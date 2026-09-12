import { GameSettings, Player, RoomState } from '../types/game';
import { applyRoundScoresToPlayers, assignRolesForRound, evaluateAccusation } from './engine';

const BOT_NAMES = ['Kuttan', 'Unni', 'Suku', 'Appu', 'Mini', 'Kochu', 'Balu', 'Ammu', 'Reshma'];
const BOT_AVATARS = ['🧔‍♂️', '👩‍🦰', '👴', '👩‍🦱', '🧔‍♀️', '👨‍🎓', '🥷', '🕵️‍♂️'];

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createInitialRoom(hostName: string, settings: GameSettings): RoomState {
  const hostPlayer: Player = {
    id: `player-host-${Date.now()}`,
    name: hostName.trim() || 'Raja Host',
    avatar: '👑',
    isHost: true,
    isBot: false,
    totalScore: 0
  };

  const roomCode = generateRoomCode();

  return {
    code: roomCode,
    settings,
    players: [hostPlayer],
    currentRound: 1,
    screenPhase: 'LOBBY',
    secretRoles: {},
    policeId: null,
    thiefId: null,
    latestResult: null,
    roundHistory: [],
    activePlayerId: hostPlayer.id
  };
}

export function addBotPlayer(room: RoomState): RoomState {
  if (room.players.length >= room.settings.playerCount) {
    return room;
  }

  const existingBotNames = room.players.filter(p => p.isBot).map(p => p.name);
  const availableNames = BOT_NAMES.filter(name => !existingBotNames.includes(name));
  const botName = availableNames[Math.floor(Math.random() * availableNames.length)] || `Bot ${room.players.length + 1}`;
  const botAvatar = BOT_AVATARS[room.players.length % BOT_AVATARS.length];

  const newBot: Player = {
    id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: botName,
    avatar: botAvatar,
    isHost: false,
    isBot: true,
    totalScore: 0
  };

  return {
    ...room,
    players: [...room.players, newBot]
  };
}

export function removePlayer(room: RoomState, playerId: string): RoomState {
  // Do not remove host unless only player
  const player = room.players.find(p => p.id === playerId);
  if (!player || (player.isHost && room.players.length > 1)) {
    return room;
  }

  const updatedPlayers = room.players.filter(p => p.id !== playerId);
  return {
    ...room,
    players: updatedPlayers
  };
}

export function fillWithBots(room: RoomState): RoomState {
  let updatedRoom = { ...room };
  while (updatedRoom.players.length < updatedRoom.settings.playerCount) {
    updatedRoom = addBotPlayer(updatedRoom);
  }
  return updatedRoom;
}

export function startRound(room: RoomState): RoomState {
  if (room.players.length < room.settings.playerCount) {
    throw new Error(`Need ${room.settings.playerCount} players to start! Currently have ${room.players.length}.`);
  }

  const { secretRoles, policeId, thiefId } = assignRolesForRound(room.players);

  return {
    ...room,
    screenPhase: 'ROLE_REVEAL',
    secretRoles,
    policeId,
    thiefId,
    latestResult: null
  };
}

export function transitionToGamePlay(room: RoomState): RoomState {
  return {
    ...room,
    screenPhase: 'GAME_PLAY'
  };
}

export function submitPoliceAccusation(room: RoomState, accusedId: string): RoomState {
  if (!room.policeId) throw new Error('No police identified for this round');

  const result = evaluateAccusation(
    room.currentRound,
    room.policeId,
    accusedId,
    room.secretRoles,
    room.players
  );

  const updatedPlayers = applyRoundScoresToPlayers(room.players, result.roundScores);

  return {
    ...room,
    players: updatedPlayers,
    latestResult: result,
    roundHistory: [...room.roundHistory, result],
    screenPhase: 'ACCUSATION_RESULT'
  };
}

export function transitionToRoundScoreboard(room: RoomState): RoomState {
  return {
    ...room,
    screenPhase: 'ROUND_SCOREBOARD'
  };
}

export function advanceToNextRoundOrFinal(room: RoomState): RoomState {
  if (room.currentRound >= room.settings.targetRounds) {
    return {
      ...room,
      screenPhase: 'FINAL_SCOREBOARD'
    };
  }

  const nextRoundNumber = room.currentRound + 1;
  const { secretRoles, policeId, thiefId } = assignRolesForRound(room.players);

  return {
    ...room,
    currentRound: nextRoundNumber,
    secretRoles,
    policeId,
    thiefId,
    latestResult: null,
    screenPhase: 'ROLE_REVEAL'
  };
}

export function resetGameForNewMatch(room: RoomState): RoomState {
  const resetPlayers = room.players.map(p => ({ ...p, totalScore: 0 }));
  return {
    ...room,
    players: resetPlayers,
    currentRound: 1,
    screenPhase: 'LOBBY',
    secretRoles: {},
    policeId: null,
    thiefId: null,
    latestResult: null,
    roundHistory: []
  };
}
