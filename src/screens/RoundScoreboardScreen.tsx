import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { RoomState } from '../types/game';
import { getRankedPlayers } from '../game/engine';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sounds } from '../utils/sound';

interface RoundScoreboardScreenProps {
  room: RoomState;
  onNextRound: () => void;
}

export const RoundScoreboardScreen: React.FC<RoundScoreboardScreenProps> = ({
  room,
  onNextRound
}) => {
  const rankedPlayers = getRankedPlayers(room.players);
  const isFinalRound = room.currentRound >= room.settings.targetRounds;
  const remainingRounds = Math.max(0, room.settings.targetRounds - room.currentRound);

  const handleNext = () => {
    sounds.playClick();
    onNextRound();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in space-y-6">
      {/* Header Card */}
      <Card borderColor="border-[#FFC83D]" className="text-center">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-[#172B4D] bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFC83D] inline-block mb-2">
          {isFinalRound ? 'MATCH COMPLETED' : `ROUND ${room.currentRound} OF ${room.settings.targetRounds}`}
        </span>

        <h2 className="text-3xl font-black text-[#172B4D] mb-2">
          Leaderboard Standings 🏆
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-[#F2F7FF] rounded-full h-3 max-w-md mx-auto my-4 overflow-hidden border-2 border-[#E4EAF2]">
          <div 
            className="bg-[#FFC83D] h-full transition-all duration-500 rounded-full"
            style={{ width: `${(room.currentRound / room.settings.targetRounds) * 100}%` }}
          />
        </div>

        <p className="text-xs text-[#52627A] font-extrabold">
          {isFinalRound 
            ? 'All rounds completed! Time to crown the winner.'
            : `${remainingRounds} ${remainingRounds === 1 ? 'round' : 'rounds'} remaining.`}
        </p>
      </Card>

      {/* Leaderboard Table Card */}
      <Card borderColor="border-[#E4EAF2]">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#52627A] flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#FFC83D]" /> Current Rank & Total Scores
        </h3>

        <div className="space-y-3">
          {rankedPlayers.map((player, index) => {
            const rank = index + 1;
            const roundScoreGained = room.latestResult?.roundScores[player.id];

            return (
              <div
                key={player.id}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 shadow-xs
                  ${rank === 1 
                    ? 'bg-[#FFF9ED] border-[#FFC83D] ring-2 ring-[#FFC83D]/50' 
                    : rank === 2 
                    ? 'bg-slate-100 border-slate-300' 
                    : rank === 3 
                    ? 'bg-[#FFF0E6] border-[#FF8A3D]/40' 
                    : 'bg-white border-[#E4EAF2]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs border-2 shadow-xs
                    ${rank === 1 
                      ? 'bg-[#FFC83D] text-[#172B4D] border-[#172B4D]' 
                      : rank === 2 
                      ? 'bg-slate-300 text-[#172B4D] border-slate-400' 
                      : rank === 3 
                      ? 'bg-[#FF8A3D] text-white border-orange-700' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'}
                  `}>
                    #{rank}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{player.avatar || '👤'}</span>
                    <div>
                      <h4 className="font-extrabold text-base text-[#172B4D] flex items-center gap-2">
                        {player.name}
                        {player.id === room.activePlayerId && (
                          <span className="text-[10px] bg-[#FFC83D]/30 text-[#172B4D] px-2 py-0.5 rounded-full font-black uppercase">
                            YOU
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-[#52627A] font-extrabold">
                        {player.isBot ? '🤖 Bot Player' : 'Player'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-xl text-[#172B4D]">
                    {player.totalScore} <span className="text-xs font-bold text-[#52627A]">PTS</span>
                  </div>
                  {roundScoreGained !== undefined && (
                    <span className="text-xs font-mono font-black text-[#35B779]">
                      +{roundScoreGained} this round
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="create"
          fullWidth
          onClick={handleNext}
          className="mt-6"
        >
          <span>{isFinalRound ? 'View Match Winner 🏆' : `Begin Round ${room.currentRound + 1}`}</span>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </Card>
    </div>
  );
};
