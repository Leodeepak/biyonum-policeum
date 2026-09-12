import React, { useState, useEffect } from 'react';
import { ShieldAlert, Eye, HelpCircle } from 'lucide-react';
import { RoomState } from '../types/game';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Modal } from '../components/Modal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sounds } from '../utils/sound';

interface GameScreenProps {
  room: RoomState;
  onAccuse: (accusedId: string) => void;
  onSwitchActivePlayer: (playerId: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  room,
  onAccuse,
  onSwitchActivePlayer
}) => {
  const activePlayer = room.players.find(p => p.id === room.activePlayerId) || room.players[0];
  const policePlayer = room.players.find(p => p.id === room.policeId) || room.players[0];

  const isCurrentPolice = (activePlayer.id === room.policeId);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [isConfirmingModalOpen, setIsConfirmingModalOpen] = useState(false);

  // If Police is a Bot, simulate AI decision after brief delay
  useEffect(() => {
    if (policePlayer.isBot) {
      sounds.playPoliceSiren();
      const possibleSuspects = room.players.filter(p => p.id !== policePlayer.id);
      const randomSuspect = possibleSuspects[Math.floor(Math.random() * possibleSuspects.length)];

      const timer = setTimeout(() => {
        if (randomSuspect) {
          onAccuse(randomSuspect.id);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [policePlayer, room.players, onAccuse]);

  const selectedSuspect = room.players.find(p => p.id === selectedSuspectId);

  const handleSelectSuspect = (playerId: string) => {
    if (playerId === room.policeId) return; // Cannot accuse self
    sounds.playClick();
    setSelectedSuspectId(playerId);
  };

  const handleConfirmAccusation = () => {
    if (!selectedSuspectId) return;
    sounds.playPoliceSiren();
    setIsConfirmingModalOpen(false);
    onAccuse(selectedSuspectId);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in space-y-6">
      {/* Top Header Panel */}
      <Card borderColor="border-[#4D8DFF]">
        <div className="flex items-center justify-between border-b-2 border-[#E4EAF2] pb-4 mb-4">
          <span className="text-xs font-mono font-extrabold text-[#172B4D] bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFC83D]">
            ROUND {room.currentRound} / {room.settings.targetRounds}
          </span>
          <span className="text-xs font-black text-[#4D8DFF] flex items-center gap-1.5 bg-[#F2F7FF] px-3 py-1 rounded-full border border-[#4D8DFF]/30">
            <ShieldAlert className="w-4 h-4 text-[#4D8DFF]" /> POLICE ACCUSATION
          </span>
        </div>

        {policePlayer.isBot ? (
          <div className="py-2 text-center">
            <h2 className="text-2xl font-black text-[#172B4D] flex items-center justify-center gap-2">
              <span className="animate-bounce">🤖</span> Bot Police <span className="text-[#4D8DFF]">{policePlayer.name}</span> is selecting a suspect...
            </h2>
          </div>
        ) : (
          <div className="py-1 text-center">
            <h2 className="text-3xl font-black text-[#172B4D] mb-1">
              Police: <span className="text-[#4D8DFF]">{policePlayer.name}</span>
            </h2>
            <p className="text-xs text-[#52627A] font-extrabold">
              {isCurrentPolice 
                ? "Tap ONE player below to accuse as the Thief!"
                : `Police officer ${policePlayer.name} is choosing a suspect...`}
            </p>
          </div>
        )}
      </Card>

      {/* Perspective Switcher */}
      <div className="bg-white rounded-2xl p-3 text-xs border-2 border-[#FFC83D] flex items-center justify-between gap-2 shadow-xs">
        <span className="text-[#172B4D] font-black flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#4D8DFF]" /> Active View:
        </span>
        <select
          value={activePlayer.id}
          onChange={e => {
            setSelectedSuspectId(null);
            onSwitchActivePlayer(e.target.value);
          }}
          className="bg-[#FFF9ED] text-[#172B4D] font-black border-2 border-[#FFC83D] rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
        >
          {room.players.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} {p.id === room.policeId ? '👮 POLICE' : ''} {p.id === activePlayer.id ? '(YOU)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Suspects List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#52627A] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#4D8DFF]" /> Select Suspect ({room.players.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {room.players.map(player => {
            const isPoliceSelf = (player.id === room.policeId);
            const isSelected = (player.id === selectedSuspectId);
            const isSelectable = isCurrentPolice && !isPoliceSelf && !policePlayer.isBot;

            return (
              <PlayerAvatar
                key={player.id}
                player={player}
                isCurrentPolice={isPoliceSelf}
                isSelected={isSelected}
                isCurrentPerspective={player.id === activePlayer.id}
                selectable={isSelectable}
                onClick={() => isSelectable && handleSelectSuspect(player.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Accuse Action Button */}
      {isCurrentPolice && !policePlayer.isBot && (
        <div className="pt-2">
          <Button
            variant="danger"
            fullWidth
            disabled={!selectedSuspectId}
            onClick={() => {
              if (selectedSuspectId) {
                sounds.playClick();
                setIsConfirmingModalOpen(true);
              }
            }}
          >
            <ShieldAlert className="w-6 h-6" />
            {selectedSuspect 
              ? `ACCUSE ${selectedSuspect.name.toUpperCase()} AS THIEF 🚨`
              : 'Select a Suspect'}
          </Button>
        </div>
      )}

      {/* Accusation Confirmation Modal */}
      <Modal
        isOpen={isConfirmingModalOpen}
        onClose={() => setIsConfirmingModalOpen(false)}
        title="🚨 Confirm Accusation"
      >
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FEEFEF] border-4 border-[#F05252] flex items-center justify-center text-4xl mx-auto shadow-md">
            🕵️‍♂️
          </div>

          <h3 className="text-2xl font-black text-[#172B4D]">
            Accuse <span className="text-[#F05252]">{selectedSuspect?.name}</span>?
          </h3>

          <p className="text-xs text-[#52627A] font-extrabold leading-relaxed px-4">
            If {selectedSuspect?.name} is the Thief, you earn 200 total points for this round. If wrong, Thief gets 100 points!
          </p>

          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsConfirmingModalOpen(false)}
            >
              Change Target
            </Button>

            <Button
              variant="danger"
              className="flex-1 font-black"
              onClick={handleConfirmAccusation}
            >
              Lock Accusation!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
