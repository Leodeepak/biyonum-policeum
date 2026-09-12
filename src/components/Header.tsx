import React from 'react';
import { BookOpen, Volume2, VolumeX } from 'lucide-react';
import { RoomState } from '../types/game';

interface HeaderProps {
  room: RoomState | null;
  onOpenRules: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReturnHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  room,
  onOpenRules,
  soundEnabled,
  onToggleSound,
  onReturnHome
}) => {
  // If in lobby/game room, show minimal room banner
  const isRoomActive = room && room.screenPhase !== 'HOME' && room.screenPhase !== 'CREATE_GAME' && room.screenPhase !== 'JOIN_GAME';

  return (
    <header className="game-header">
      <div 
        onClick={onReturnHome}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#FFC83D',
          border: '2px solid #172B4D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 900
        }}>
          👑
        </div>
        {isRoomActive && (
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#172B4D' }}>
            Biyonum Policeum
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isRoomActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #E4EAF2',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 800
          }}>
            <span style={{ color: '#52627A' }}>ROOM: <strong style={{ color: '#172B4D', fontFamily: 'monospace' }}>{room.code}</strong></span>
            <span style={{ color: '#E4EAF2' }}>|</span>
            <span style={{ color: '#172B4D' }}>ROUND {room.currentRound} / {room.settings.targetRounds}</span>
          </div>
        )}

        <button
          onClick={onOpenRules}
          className="btn-secondary"
          style={{ height: '42px', minHeight: '42px', padding: '0 14px', fontSize: '12px', width: 'auto' }}
          title="How to Play"
        >
          <BookOpen style={{ width: '16px', height: '16px' }} />
          <span>Rules</span>
        </button>

        <button
          onClick={onToggleSound}
          className="btn-secondary"
          style={{ height: '42px', minHeight: '42px', padding: '0 12px', width: 'auto' }}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 style={{ width: '16px', height: '16px', color: '#35B779' }} /> : <VolumeX style={{ width: '16px', height: '16px', color: '#52627A' }} />}
        </button>
      </div>
    </header>
  );
};
