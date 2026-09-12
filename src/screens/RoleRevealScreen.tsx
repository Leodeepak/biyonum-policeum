import React, { useState } from 'react';
import { Eye, ArrowRight, Lock } from 'lucide-react';
import { RoomState } from '../types/game';
import { RoleCard } from '../components/RoleCard';
import { Button } from '../components/ui/Button';
import { sounds } from '../utils/sound';

interface RoleRevealScreenProps {
  room: RoomState;
  onContinueToGame: () => void;
  onSwitchActivePlayer: (playerId: string) => void;
}

export const RoleRevealScreen: React.FC<RoleRevealScreenProps> = ({
  room,
  onContinueToGame,
  onSwitchActivePlayer
}) => {
  const activePlayer = room.players.find(p => p.id === room.activePlayerId) || room.players[0];
  const assignedRole = room.secretRoles[activePlayer.id] || 'police';

  const [isFlipped, setIsFlipped] = useState(false);

  const handleContinue = () => {
    sounds.playClick();
    onContinueToGame();
  };

  return (
    <div className="max-w-md mx-auto py-6 animate-fade-in text-center space-y-6">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-[#52627A] block mb-1">
          ROUND {room.currentRound} OF {room.settings.targetRounds}
        </span>
        <h2 className="text-3xl font-black text-[#172B4D]">
          Secret Role Reveal
        </h2>
      </div>

      {/* Perspective Switcher for local testing/pass-and-play */}
      {room.players.length > 1 && (
        <div className="bg-white rounded-2xl p-3 text-xs border-2 border-[#FFC83D] flex items-center justify-between gap-2 shadow-xs">
          <span className="text-[#172B4D] font-black flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#4D8DFF]" /> Active Player:
          </span>
          <select
            value={activePlayer.id}
            onChange={e => {
              setIsFlipped(false);
              onSwitchActivePlayer(e.target.value);
            }}
            className="bg-[#FFF9ED] text-[#172B4D] font-black border-2 border-[#FFC83D] rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
          >
            {room.players.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {p.isBot ? '(Bot)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3D Card Reveal */}
      <RoleCard
        roleType={assignedRole}
        playerName={activePlayer.name}
        isFlipped={isFlipped}
        onFlipToggle={setIsFlipped}
      />

      {/* Secrecy Warning */}
      <div className="p-4 rounded-2xl bg-[#FFF9ED] border-2 border-[#FFC83D] text-[#172B4D] text-xs font-black flex items-center justify-center gap-2 shadow-xs">
        <Lock className="w-4 h-4 text-[#FFC83D]" />
        <span>Keep your role secret from other players!</span>
      </div>

      {/* Continue Action */}
      <Button
        variant="create"
        fullWidth
        onClick={handleContinue}
      >
        <span>PROCEED TO INTERROGATION</span>
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
};
