import React, { useState } from 'react';
import { Copy, Check, UserPlus, Play, Bot, Users, Trash2 } from 'lucide-react';
import { RoomState } from '../types/game';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sounds } from '../utils/sound';

interface LobbyScreenProps {
  room: RoomState;
  onAddBot: () => void;
  onFillBots: () => void;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  onAddBot,
  onFillBots,
  onRemovePlayer,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);

  const activePlayer = room.players.find(p => p.id === room.activePlayerId) || room.players[0];
  const isHost = activePlayer?.isHost ?? false;
  const isRoomFull = room.players.length >= room.settings.playerCount;

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    sounds.playClick();
    onStartGame();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in space-y-6">
      <Card borderColor="border-[#FFC83D]">
        {/* ROOM CODE DISPLAY CARD */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-[#E4EAF2]">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#52627A] block mb-1">
              ROOM CODE
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-4xl font-black font-mono tracking-wider text-[#172B4D] bg-[#FFF9ED] px-4 py-1.5 rounded-2xl border-2 border-[#FFC83D]">
                {room.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-xl bg-white hover:bg-[#FFF9ED] text-[#172B4D] transition-colors border-2 border-[#E4EAF2] cursor-pointer"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-5 h-5 text-[#35B779]" /> : <Copy className="w-5 h-5 text-[#172B4D]" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#F2F7FF] border-2 border-[#4D8DFF]/30 text-xs font-black">
              <span className="text-[#52627A] block text-[10px] uppercase">PLAYERS</span>
              <span className="text-[#172B4D] font-mono text-sm font-black">
                {room.players.length} / {room.settings.playerCount}
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#FFF9ED] border-2 border-[#FFC83D]/40 text-xs font-black">
              <span className="text-[#52627A] block text-[10px] uppercase">ROUNDS</span>
              <span className="text-[#172B4D] font-mono text-sm font-black">
                {room.settings.targetRounds} Rounds
              </span>
            </div>
          </div>
        </div>

        {/* PLAYERS SECTION HEADER */}
        <div className="pt-6 flex items-center justify-between">
          <h3 className="text-lg font-black text-[#172B4D] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#4D8DFF]" /> PLAYERS
          </h3>

          {isHost && !isRoomFull && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  sounds.playClick();
                  onAddBot();
                }}
                className="text-xs px-3 py-2 min-h-0 h-10"
              >
                <UserPlus className="w-4 h-4 text-[#4D8DFF]" /> + Bot
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  sounds.playClick();
                  onFillBots();
                }}
                className="text-xs px-3 py-2 min-h-0 h-10 border-[#FFC83D] bg-[#FFF9ED] text-[#172B4D]"
              >
                <Bot className="w-4 h-4 text-[#FFC83D]" /> Auto-Fill
              </Button>
            </div>
          )}
        </div>

        {/* PLAYERS LIST GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {room.players.map(p => (
            <div key={p.id} className="relative group">
              <PlayerAvatar
                player={p}
                isCurrentPerspective={p.id === room.activePlayerId}
              />
              {isHost && p.id !== activePlayer.id && (
                <button
                  onClick={() => onRemovePlayer(p.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors border border-rose-300 cursor-pointer"
                  title="Remove player"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Empty Seats */}
          {Array.from({ length: room.settings.playerCount - room.players.length }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border-2 border-dashed border-[#E4EAF2] bg-[#FFF9ED]/30 flex items-center justify-center text-xs text-[#52627A] font-extrabold"
            >
              Waiting for player {room.players.length + idx + 1}...
            </div>
          ))}
        </div>

        {/* ACTION CONTROLS */}
        <div className="pt-6 border-t-2 border-[#E4EAF2] mt-6 space-y-4">
          {isHost ? (
            <Button
              variant="create"
              fullWidth
              disabled={!isRoomFull}
              onClick={handleStart}
            >
              <Play className="w-6 h-6 fill-[#172B4D] text-[#172B4D]" />
              {isRoomFull ? 'START GAME' : `WAITING FOR ${room.settings.playerCount - room.players.length} MORE PLAYERS...`}
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFF9ED] border-2 border-[#FFC83D] text-center font-black text-[#172B4D]">
              WAITING FOR HOST
            </div>
          )}

          <button
            onClick={onLeaveRoom}
            className="text-xs text-[#52627A] hover:text-[#F05252] font-black block mx-auto transition-colors cursor-pointer"
          >
            Leave Lobby
          </button>
        </div>
      </Card>
    </div>
  );
};
