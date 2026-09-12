export type RoleType = 
  | 'king'
  | 'queen'
  | 'minister'
  | 'soldier'
  | 'slave'
  | 'police'
  | 'thief';

export interface RoleDefinition {
  type: RoleType;
  name: string;
  malayalamTitle: string;
  points: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  symbol: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isBot: boolean;
  totalScore: number;
}

export interface GameSettings {
  playerCount: number; // 3 to 7
  targetRounds: number; // 3, 5, 7, 10, 12, 15
}

export interface RoundResult {
  roundNumber: number;
  policeId: string;
  thiefId: string;
  accusedId: string;
  accusedRole: RoleType;
  wasPoliceCorrect: boolean;
  roundScores: Record<string, number>; // playerId -> points earned this round
}

export type ScreenPhase = 
  | 'HOME'
  | 'CREATE_GAME'
  | 'JOIN_GAME'
  | 'LOBBY'
  | 'ROLE_REVEAL'
  | 'GAME_PLAY'
  | 'ACCUSATION_RESULT'
  | 'ROUND_SCOREBOARD'
  | 'FINAL_SCOREBOARD';

export interface RoomState {
  code: string;
  settings: GameSettings;
  players: Player[];
  currentRound: number;
  screenPhase: ScreenPhase;
  secretRoles: Record<string, RoleType>; // Sever authoritative: playerId -> RoleType
  policeId: string | null;
  thiefId: string | null;
  latestResult: RoundResult | null;
  roundHistory: RoundResult[];
  activePlayerId: string; // The player currently viewing/interacting on this client
}
