import React, { useState } from 'react';
import { Users, RotateCw, ArrowLeft, Play, User } from 'lucide-react';
import { GameSettings } from '../types/game';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { OptionSelector } from '../components/ui/OptionSelector';
import { sounds } from '../utils/sound';

interface CreateGameScreenProps {
  onCreateRoom: (hostName: string, settings: GameSettings) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const CreateGameScreen: React.FC<CreateGameScreenProps> = ({
  onCreateRoom,
  onBack,
  isLoading = false,
  error = null,
}) => {
  const [hostName, setHostName] = useState('Host Player');
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [targetRounds, setTargetRounds] = useState<number>(3);

  const playerOptions = [3, 4, 5, 6, 7];
  const roundOptions = [3, 5, 7, 10, 12, 15];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    sounds.playClick();
    onCreateRoom(hostName, { playerCount, targetRounds });
  };

  return (
    <div className="max-w-xl mx-auto py-6 animate-fade-in space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-[#52627A] hover:text-[#172B4D] font-extrabold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <Card borderColor="border-[#E4EAF2]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#172B4D]">
            Create Game Room
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PLAYER NAME */}
          <Input
            label="PLAYER NAME"
            icon={<User className="w-4 h-4 text-[#4D8DFF]" />}
            type="text"
            value={hostName}
            onChange={e => setHostName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            required
          />

          {/* NUMBER OF PLAYERS */}
          <OptionSelector
            label="NUMBER OF PLAYERS"
            icon={<Users className="w-4 h-4 text-[#4D8DFF]" />}
            options={playerOptions}
            value={playerCount}
            onChange={setPlayerCount}
            formatOption={(cnt) => `${cnt}`}
          />

          {/* NUMBER OF ROUNDS */}
          <OptionSelector
            label="NUMBER OF ROUNDS"
            icon={<RotateCw className="w-4 h-4 text-[#4D8DFF]" />}
            options={roundOptions}
            value={targetRounds}
            onChange={setTargetRounds}
            formatOption={(rnd) => `${rnd}`}
          />

          {/* CREATE ROOM BUTTON */}
          <Button
            type="submit"
            variant="create"
            fullWidth
            className="mt-4"
            disabled={isLoading}
          >
            <Play className="w-6 h-6 fill-[#172B4D] text-[#172B4D]" />
            {isLoading ? 'CREATING...' : 'CREATE ROOM'}
          </Button>

          {/* FIREBASE ERROR */}
          {error && (
            <p className="text-center text-sm font-bold text-rose-600 mt-2">{error}</p>
          )}
        </form>
      </Card>
    </div>
  );
};
