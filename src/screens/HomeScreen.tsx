import React from 'react';
import { PlusCircle, LogIn, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { sounds } from '../utils/sound';

interface HomeScreenProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
  onOpenRules: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateGame,
  onJoinGame,
  onOpenRules
}) => {
  const handleCreate = () => {
    sounds.playClick();
    onCreateGame();
  };

  const handleJoin = () => {
    sounds.playClick();
    onJoinGame();
  };

  const handleRules = () => {
    sounds.playClick();
    onOpenRules();
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '32px 0',
      textAlign: 'center',
      gap: '32px',
      maxWidth: '440px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Game Visual Emblem */}
      <div style={{ position: 'relative', margin: '8px 0' }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '32px',
          backgroundColor: '#FFC83D',
          border: '4px solid #172B4D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          boxShadow: '0 16px 32px -8px rgba(255, 200, 61, 0.4)',
          transform: 'rotate(-2deg)'
        }} className="animate-float">
          👑
        </div>
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px',
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          backgroundColor: '#4D8DFF',
          border: '3px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 8px 16px rgba(77, 141, 255, 0.3)'
        }}>
          👮
        </div>
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          backgroundColor: '#F05252',
          border: '3px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 8px 16px rgba(240, 82, 82, 0.3)'
        }}>
          🥷
        </div>
      </div>

      {/* Game Title & Preferred Subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h1 className="game-title">
          Biyonum Policeum
        </h1>
        <p style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#52627A',
          letterSpacing: '0.04em'
        }}>
          Play. Guess. Score.
        </p>
      </div>

      {/* 3 Main Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}>
        <Button
          variant="create"
          fullWidth
          onClick={handleCreate}
        >
          <PlusCircle style={{ width: '24px', height: '24px' }} />
          CREATE GAME
        </Button>

        <Button
          variant="join"
          fullWidth
          onClick={handleJoin}
        >
          <LogIn style={{ width: '24px', height: '24px' }} />
          JOIN GAME
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleRules}
        >
          <BookOpen style={{ width: '20px', height: '20px' }} />
          HOW TO PLAY
        </Button>
      </div>
    </div>
  );
};
