import { Player, RoleType, RoundResult } from '../types/game';
import { getActiveRolesForPlayerCount, ROLE_DEFINITIONS } from '../data/rolesData';

/**
 * Cryptographically safe Fisher-Yates array shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Generate secure random integer in [0, i]
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface AssignedRolesResult {
  secretRoles: Record<string, RoleType>;
  policeId: string;
  thiefId: string;
}

/**
 * Assigns shuffled roles to players based on player count.
 */
export function assignRolesForRound(players: Player[]): AssignedRolesResult {
  const activeRoles = getActiveRolesForPlayerCount(players.length);
  const shuffledRoles = shuffleArray(activeRoles);

  const secretRoles: Record<string, RoleType> = {};
  let policeId = '';
  let thiefId = '';

  players.forEach((player, idx) => {
    const assignedRole = shuffledRoles[idx];
    secretRoles[player.id] = assignedRole;
    if (assignedRole === 'police') {
      policeId = player.id;
    } else if (assignedRole === 'thief') {
      thiefId = player.id;
    }
  });

  return { secretRoles, policeId, thiefId };
}

/**
 * Evaluates the Police's accusation and calculates scores for the round.
 * 
 * Rules:
 * - Police catches Thief: Police gets +100 bonus (total 100 + 100 = 200), Thief gets 0.
 * - Police fails: Police gets +0 bonus (total 100), Thief gets +100 bonus (total 0 + 100 = 100).
 * - All other roles receive their standard role points (King=1000, Queen=800, etc.).
 */
export function evaluateAccusation(
  roundNumber: number,
  policeId: string,
  accusedId: string,
  secretRoles: Record<string, RoleType>,
  players: Player[]
): RoundResult {
  const accusedRole = secretRoles[accusedId];
  const thiefId = Object.keys(secretRoles).find(id => secretRoles[id] === 'thief') || '';
  const wasPoliceCorrect = (accusedRole === 'thief');

  const roundScores: Record<string, number> = {};

  players.forEach(player => {
    const role = secretRoles[player.id];
    const basePoints = ROLE_DEFINITIONS[role].points;
    let bonusPoints = 0;

    if (role === 'police') {
      bonusPoints = wasPoliceCorrect ? 100 : 0;
    } else if (role === 'thief') {
      bonusPoints = wasPoliceCorrect ? 0 : 100;
    }

    roundScores[player.id] = basePoints + bonusPoints;
  });

  return {
    roundNumber,
    policeId,
    thiefId,
    accusedId,
    accusedRole,
    wasPoliceCorrect,
    roundScores
  };
}

/**
 * Calculates updated cumulative scores for players based on round results.
 */
export function applyRoundScoresToPlayers(players: Player[], roundScores: Record<string, number>): Player[] {
  return players.map(player => ({
    ...player,
    totalScore: player.totalScore + (roundScores[player.id] || 0)
  }));
}

/**
 * Computes rankings (descending order by totalScore)
 */
export function getRankedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.totalScore - a.totalScore);
}
