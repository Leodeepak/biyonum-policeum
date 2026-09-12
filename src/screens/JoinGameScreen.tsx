import React, { useState } from 'react';
import { ArrowLeft, LogIn, KeyRound, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { sounds } from '../utils/sound';

interface JoinGameScreenProps {
  onJoinRoom: (roomCode: string, playerName: string) => void;
  onBack: () => void;
}

export const JoinGameScreen: React.FC<JoinGameScreenProps> = ({
  onJoinRoom,
  onBack
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('Chacko');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) return;
    sounds.playClick();
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-[#52627A] hover:text-[#172B4D] font-extrabold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <Card borderColor="border-[#4D8DFF]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#172B4D]">
            Join Room
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ROOM CODE */}
          <Input
            label="ROOM CODE"
            icon={<KeyRound className="w-4 h-4 text-[#4D8DFF]" />}
            type="text"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={5}
            className="tracking-widest font-mono text-center text-2xl font-black uppercase text-[#172B4D] bg-[#F2F7FF] border-[#4D8DFF]"
            required
          />

          {/* PLAYER NAME */}
          <Input
            label="PLAYER NAME"
            icon={<User className="w-4 h-4 text-[#4D8DFF]" />}
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            required
          />

          {/* JOIN ROOM BUTTON */}
          <Button
            type="submit"
            variant="join"
            fullWidth
            className="mt-4"
          >
            <LogIn className="w-6 h-6 text-white" />
            JOIN ROOM
          </Button>
        </form>
      </Card>
    </div>
  );
};
