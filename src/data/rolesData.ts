import { RoleDefinition, RoleType } from '../types/game';

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  king: {
    type: 'king',
    name: 'King',
    malayalamTitle: 'King',
    points: 1000,
    color: '#FFC83D', // Golden Yellow
    bgColor: '#FFF8E1',
    borderColor: '#FFC83D',
    description: 'Highest court role. Earns 1000 points every round.',
    symbol: '👑'
  },
  queen: {
    type: 'queen',
    name: 'Queen',
    malayalamTitle: 'Queen',
    points: 800,
    color: '#F15BB5', // Pink
    bgColor: '#FDEBF7',
    borderColor: '#F15BB5',
    description: 'Royal rank. Earns 800 points every round.',
    symbol: '👸'
  },
  minister: {
    type: 'minister',
    name: 'Minister',
    malayalamTitle: 'Minister',
    points: 600,
    color: '#8B5CF6', // Purple
    bgColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    description: 'Advisor rank. Earns 600 points every round.',
    symbol: '📜'
  },
  soldier: {
    type: 'soldier',
    name: 'Soldier',
    malayalamTitle: 'Soldier',
    points: 500,
    color: '#FF8A3D', // Orange
    bgColor: '#FFF0E6',
    borderColor: '#FF8A3D',
    description: 'Defender rank. Earns 500 points every round.',
    symbol: '🛡️'
  },
  slave: {
    type: 'slave',
    name: 'Slave',
    malayalamTitle: 'Slave',
    points: 400,
    color: '#32C48D', // Green
    bgColor: '#E6F9F2',
    borderColor: '#32C48D',
    description: 'Worker rank. Earns 400 points every round.',
    symbol: '🔨'
  },
  police: {
    type: 'police',
    name: 'Police',
    malayalamTitle: 'Police',
    points: 100,
    color: '#4D8DFF', // Blue
    bgColor: '#EBF2FF',
    borderColor: '#4D8DFF',
    description: 'Investigator. Accuse 1 suspect as Thief to earn 200 total points.',
    symbol: '👮'
  },
  thief: {
    type: 'thief',
    name: 'Thief',
    malayalamTitle: 'Thief',
    points: 0,
    color: '#F05252', // Red
    bgColor: '#FEEFEF',
    borderColor: '#F05252',
    description: 'Hidden rogue. If Police fails to catch you, earn 100 total points.',
    symbol: '🥷'
  }
};

export function getActiveRolesForPlayerCount(count: number): RoleType[] {
  switch (count) {
    case 3:
      return ['king', 'police', 'thief'];
    case 4:
      return ['king', 'queen', 'police', 'thief'];
    case 5:
      return ['king', 'queen', 'minister', 'police', 'thief'];
    case 6:
      return ['king', 'queen', 'minister', 'soldier', 'police', 'thief'];
    case 7:
      return ['king', 'queen', 'minister', 'soldier', 'slave', 'police', 'thief'];
    default:
      return ['king', 'police', 'thief'];
  }
}
