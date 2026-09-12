import React from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';
import { RoomState } from '../types/game';
import { getRankedPlayers } from '../game/engine';
import { ConfettiEffect } from '../components/Confetti';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sounds } from '../utils/sound';

interface FinalScoreboardScreenProps {
  room: RoomState;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const FinalScoreboardScreen: React.FC<FinalScoreboardScreenProps> = ({
  room,
  onPlayAgain,
  onReturnHome
}) => {
  const rankedPlayers = getRankedPlayers(room.players);
  const winner = rankedPlayers[0];
  const runnerUp = rankedPlayers[1];
  const thirdPlace = rankedPlayers[2];

  const handlePlayAgain = () => {
    sounds.playClick();
    onPlayAgain();
  };

  const handleHome = () => {
    sounds.playClick();
    onReturnHome();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in space-y-6">
      {/* Celebration Confetti */}
      <ConfettiEffect />

      {/* Winner Hero Banner */}
      <Card borderColor="border-[#FFC83D]" className="text-center bg-gradient-to-b from-[#FFF9ED] via-[#FFF8E1] to-white">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-[#172B4D] bg-[#FFC83D]/30 px-4 py-1.5 rounded-full border border-[#FFC83D] inline-block mb-2">
          BIYONUM POLICEUM CHAMPION
        </span>

        {/* Winner Crown & Avatar */}
        <div className="relative inline-block my-4">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FFC83D] border-4 border-[#172B4D] flex items-center justify-center text-6xl shadow-xl shadow-amber-500/30 animate-pulse">
            {winner.avatar || '👑'}
          </div>
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
            👑
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#172B4D] mb-1">
          {winner.name}
        </h1>

        <p className="text-base font-extrabold text-[#172B4D] font-mono mb-4">
          CHAMPION WITH {winner.totalScore} TOTAL POINTS! 🎉
        </p>

        {/* Podium Top 3 Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-6 border-t-2 border-[#E4EAF2]">
          {/* 2nd Place */}
          {runnerUp && (
            <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-300 flex flex-col items-center justify-end text-center shadow-xs">
              <span className="text-3xl mb-1">{runnerUp.avatar}</span>
              <span className="text-xs font-black text-[#172B4D] truncate max-w-full">{runnerUp.name}</span>
              <span className="text-xs text-[#52627A] font-mono font-extrabold mt-0.5">{runnerUp.totalScore} pts</span>
              <span className="mt-2 text-[10px] font-black uppercase text-slate-700 px-2.5 py-1 rounded-full bg-slate-200 border border-slate-300">
                2nd Place 🥈
              </span>
            </div>
          )}

          {/* 1st Place */}
          <div className="p-4 rounded-3xl bg-[#FFC83D] border-3 border-[#172B4D] flex flex-col items-center justify-end text-center shadow-md transform sm:-translate-y-2">
            <span className="text-4xl mb-1">{winner.avatar}</span>
            <span className="text-sm font-black text-[#172B4D] truncate max-w-full">{winner.name}</span>
            <span className="text-xs font-black text-[#172B4D] font-mono mt-0.5">{winner.totalScore} pts</span>
            <span className="mt-2 text-[11px] font-black uppercase text-[#172B4D] px-3 py-1 rounded-full bg-white shadow-xs">
              WINNER 🏆
            </span>
          </div>

          {/* 3rd Place */}
          {thirdPlace && (
            <div className="p-3.5 rounded-3xl bg-white border-2 border-amber-200 flex flex-col items-center justify-end text-center shadow-xs">
              <span className="text-3xl mb-1">{thirdPlace.avatar}</span>
              <span className="text-xs font-black text-amber-900 truncate max-w-full">{thirdPlace.name}</span>
              <span className="text-xs text-amber-700 font-mono font-extrabold mt-0.5">{thirdPlace.totalScore} pts</span>
              <span className="mt-2 text-[10px] font-black uppercase text-amber-900 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                3rd Place 🥉
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Full Match Standings */}
      <Card borderColor="border-[#E4EAF2]">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#52627A] flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#FFC83D]" /> Full Match Standings ({room.settings.targetRounds} Rounds)
        </h3>

        <div className="space-y-2.5">
          {rankedPlayers.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border-2 border-[#E4EAF2] text-xs shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-[#52627A] w-6 text-center text-sm">#{idx + 1}</span>
                <span className="text-2xl">{player.avatar}</span>
                <div>
                  <span className="font-extrabold text-[#172B4D] text-base block">{player.name}</span>
                  <span className="text-[10px] text-[#52627A] font-bold">{player.isBot ? '🤖 Bot Player' : 'Player'}</span>
                </div>
              </div>

              <span className="font-mono font-black text-[#172B4D] text-base">
                {player.totalScore} PTS
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t-2 border-[#E4EAF2] mt-6">
          <Button
            variant="create"
            fullWidth
            onClick={handlePlayAgain}
          >
            <RotateCcw className="w-5 h-5 text-[#172B4D]" />
            Play Again (Same Room)
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleHome}
          >
            <Home className="w-5 h-5 text-[#4D8DFF]" />
            Return to Main Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};
