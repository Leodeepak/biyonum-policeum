import React, { useState } from 'react';
import { GameSettings, RoomState } from './types/game';
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

  // 1. Create Room
  const handleCreateRoom = (hostName: string, settings: GameSettings) => {
    const newRoom = createInitialRoom(hostName, settings);
    setRoom(newRoom);
    setCurrentView('HOME');
  };

  // 2. Join Room (Local simulation / mock)
  const handleJoinRoom = (roomCode: string, playerName: string) => {
    // If a room exists locally, join it; otherwise create mock join room
    let targetRoom = room;
    if (!targetRoom || targetRoom.code !== roomCode) {
      targetRoom = createInitialRoom('Host Raja', { playerCount: 5, targetRounds: 5 });
      targetRoom.code = roomCode;
    }

    const newPlayer = {
      id: `player-joined-${Date.now()}`,
      name: playerName,
      avatar: '🕵️',
      isHost: false,
      isBot: false,
      totalScore: 0
    };

    const updatedRoom: RoomState = {
      ...targetRoom,
      players: [...targetRoom.players, newPlayer],
      activePlayerId: newPlayer.id
    };

    setRoom(updatedRoom);
    setCurrentView('HOME');
  };

  // 3. Lobby Actions
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

  const handleLeaveRoom = () => {
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
                onCreateGame={() => setCurrentView('CREATE')}
                onJoinGame={() => setCurrentView('JOIN')}
                onOpenRules={() => setIsRulesModalOpen(true)}
              />
            )}

            {currentView === 'CREATE' && (
              <CreateGameScreen
                onCreateRoom={handleCreateRoom}
                onBack={() => setCurrentView('HOME')}
              />
            )}

            {currentView === 'JOIN' && (
              <JoinGameScreen
                onJoinRoom={handleJoinRoom}
                onBack={() => setCurrentView('HOME')}
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
