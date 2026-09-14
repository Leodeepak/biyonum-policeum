import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameSettings, Player, RoomState } from './types/game';
import { 
  createInitialRoom, 
  addBotPlayer, 
  fillWithBots, 
  removePlayer, 
  startRound, 
  transitionToGamePlay, 
  submitPoliceAccusation, 
  transitionToRoundScoreboard, 
  advanceToNextRoundOrFinal, 
  resetGameForNewMatch 
} from './game/roomManager';
import {
  createFirestoreRoom,
  joinFirestoreRoom,
  subscribeToFirestoreRoom,
} from './game/firestoreRooms';

import { Header } from './components/Header';
import { RulesModal } from './components/RulesModal';

import { HomeScreen } from './screens/HomeScreen';
import { CreateGameScreen } from './screens/CreateGameScreen';
import { JoinGameScreen } from './screens/JoinGameScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { RoleRevealScreen } from './screens/RoleRevealScreen';
import { GameScreen } from './screens/GameScreen';
import { AccusationResultScreen } from './screens/AccusationResultScreen';
import { RoundScoreboardScreen } from './screens/RoundScoreboardScreen';
import { FinalScoreboardScreen } from './screens/FinalScoreboardScreen';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'CREATE' | 'JOIN'>('HOME');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Async operation state for Create/Join flows
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Per-client player identity — never overwritten by Firestore snapshots
  const clientPlayerIdRef = useRef<string | null>(null);

  // Holds the active Firestore unsubscribe function
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /** Tear down the current Firestore subscription without touching Firestore data */
  const cancelSubscription = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  /**
   * Start a live Firestore subscription for the given room code.
   * Snapshot updates are merged with the client-local activePlayerId so
   * each browser always sees its own player perspective.
   */
  const startSubscription = useCallback((roomCode: string) => {
    cancelSubscription();
    const unsubscribe = subscribeToFirestoreRoom(roomCode, (updatedRoom: RoomState) => {
      setRoom((prev) => ({
        ...updatedRoom,
        // Preserve the local client's own player identity
        activePlayerId: clientPlayerIdRef.current ?? updatedRoom.activePlayerId,
        // Keep any local screenPhase overrides if the host hasn't pushed a change yet
        screenPhase: prev?.code === updatedRoom.code ? updatedRoom.screenPhase : prev?.screenPhase ?? updatedRoom.screenPhase,
      }));
    });
    unsubscribeRef.current = unsubscribe;
  }, [cancelSubscription]);

  // Cancel the subscription when the component unmounts
  useEffect(() => {
    return () => {
      cancelSubscription();
    };
  }, [cancelSubscription]);

  // 1. Create Room — Firestore-backed
  const handleCreateRoom = async (hostName: string, settings: GameSettings) => {
    setIsLoading(true);
    setFirebaseError(null);
    try {
      const newRoom = createInitialRoom(hostName, settings);
      // Record this client's player ID before writing to Firestore
      clientPlayerIdRef.current = newRoom.players[0].id;
      await createFirestoreRoom(newRoom);
      setRoom(newRoom);
      setCurrentView('HOME');
      // Subscribe so the lobby updates live on this client too
      startSubscription(newRoom.code);
    } catch (err) {
      setFirebaseError((err as Error).message || 'Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Join Room — Firestore-backed
  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setIsLoading(true);
    setFirebaseError(null);
    try {
      const newPlayer: Player = {
        id: `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: playerName.trim() || 'Player',
        avatar: '🕵️',
        isHost: false,
        isBot: false,
        totalScore: 0,
      };
      // Record this client's player ID before subscribing
      clientPlayerIdRef.current = newPlayer.id;
      const joinedRoom = await joinFirestoreRoom(roomCode, newPlayer);
      // Set local state with our own activePlayerId
      setRoom({ ...joinedRoom, activePlayerId: newPlayer.id });
      setCurrentView('HOME');
      // Subscribe so the lobby updates live on this client too
      startSubscription(roomCode);
    } catch (err) {
      setFirebaseError((err as Error).message || 'Failed to join room. Please check the room code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Lobby Actions (host-only; local state only — Firestore sync not yet wired for bots/remove)
  const handleAddBot = () => {
    if (!room) return;
    setRoom(addBotPlayer(room));
  };

  const handleFillBots = () => {
    if (!room) return;
    setRoom(fillWithBots(room));
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!room) return;
    setRoom(removePlayer(room, playerId));
  };

  const handleStartGame = () => {
    if (!room) return;
    try {
      const updated = startRound(room);
      setRoom(updated);
    } catch (err) {
      console.warn((err as Error).message);
    }
  };

  /**
   * Leave Lobby — only cancels the local subscription and clears local state.
   * Does NOT delete the Firestore room or modify the Firestore player list.
   */
  const handleLeaveRoom = () => {
    cancelSubscription();
    clientPlayerIdRef.current = null;
    setRoom(null);
    setCurrentView('HOME');
  };

  // 4. Role Reveal -> Game Play
  const handleContinueToGame = () => {
    if (!room) return;
    setRoom(transitionToGamePlay(room));
  };

  const handleSwitchActivePlayer = (playerId: string) => {
    if (!room) return;
    clientPlayerIdRef.current = playerId;
    setRoom({ ...room, activePlayerId: playerId });
  };

  // 5. Accusation
  const handleAccuse = (accusedId: string) => {
    if (!room) return;
    setRoom(submitPoliceAccusation(room, accusedId));
  };

  // 6. Result -> Round Scoreboard
  const handleContinueToScoreboard = () => {
    if (!room) return;
    setRoom(transitionToRoundScoreboard(room));
  };

  // 7. Round Scoreboard -> Next Round or Final
  const handleNextRound = () => {
    if (!room) return;
    setRoom(advanceToNextRoundOrFinal(room));
  };

  // 8. Rematch / Reset
  const handlePlayAgain = () => {
    if (!room) return;
    setRoom(resetGameForNewMatch(room));
  };

  return (
    <div className="app-container">
      <Header
        room={room}
        onOpenRules={() => setIsRulesModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onReturnHome={() => {
          cancelSubscription();
          clientPlayerIdRef.current = null;
          setRoom(null);
          setCurrentView('HOME');
        }}
      />

      <main className="flex-1 flex flex-col justify-center">
        {/* Render View based on whether player is in a room */}
        {!room ? (
          <>
            {currentView === 'HOME' && (
              <HomeScreen
                onCreateGame={() => {
                  setFirebaseError(null);
                  setCurrentView('CREATE');
                }}
                onJoinGame={() => {
                  setFirebaseError(null);
                  setCurrentView('JOIN');
                }}
                onOpenRules={() => setIsRulesModalOpen(true)}
              />
            )}

            {currentView === 'CREATE' && (
              <CreateGameScreen
                onCreateRoom={handleCreateRoom}
                onBack={() => {
                  setFirebaseError(null);
                  setCurrentView('HOME');
                }}
                isLoading={isLoading}
                error={firebaseError}
              />
            )}

            {currentView === 'JOIN' && (
              <JoinGameScreen
                onJoinRoom={handleJoinRoom}
                onBack={() => {
                  setFirebaseError(null);
                  setCurrentView('HOME');
                }}
                isLoading={isLoading}
                error={firebaseError}
              />
            )}
          </>
        ) : (
          <>
            {room.screenPhase === 'LOBBY' && (
              <LobbyScreen
                room={room}
                onAddBot={handleAddBot}
                onFillBots={handleFillBots}
                onRemovePlayer={handleRemovePlayer}
                onStartGame={handleStartGame}
                onLeaveRoom={handleLeaveRoom}
              />
            )}

            {room.screenPhase === 'ROLE_REVEAL' && (
              <RoleRevealScreen
                room={room}
                onContinueToGame={handleContinueToGame}
                onSwitchActivePlayer={handleSwitchActivePlayer}
              />
            )}

            {room.screenPhase === 'GAME_PLAY' && (
              <GameScreen
                room={room}
                onAccuse={handleAccuse}
                onSwitchActivePlayer={handleSwitchActivePlayer}
              />
            )}

            {room.screenPhase === 'ACCUSATION_RESULT' && (
              <AccusationResultScreen
                room={room}
                onContinueToScoreboard={handleContinueToScoreboard}
              />
            )}

            {room.screenPhase === 'ROUND_SCOREBOARD' && (
              <RoundScoreboardScreen
                room={room}
                onNextRound={handleNextRound}
              />
            )}

            {room.screenPhase === 'FINAL_SCOREBOARD' && (
              <FinalScoreboardScreen
                room={room}
                onPlayAgain={handlePlayAgain}
                onReturnHome={handleLeaveRoom}
              />
            )}
          </>
        )}
      </main>

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};
