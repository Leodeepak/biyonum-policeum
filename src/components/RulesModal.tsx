import React from 'react';
import { Modal } from './Modal';
import { ROLE_DEFINITIONS } from '../data/rolesData';
import { RoleType } from '../types/game';
import { RoleIllustration } from './RoleIllustrations';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const roleKeys: RoleType[] = ['king', 'queen', 'minister', 'soldier', 'slave', 'police', 'thief'];

  const playerRoleSets = [
    { count: 3, combination: 'King + Police + Thief' },
    { count: 4, combination: 'King + Queen + Police + Thief' },
    { count: 5, combination: 'King + Queen + Minister + Police + Thief' },
    { count: 6, combination: 'King + Queen + Minister + Soldier + Police + Thief' },
    { count: 7, combination: 'King + Queen + Minister + Soldier + Slave + Police + Thief' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎮 HOW TO PLAY">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 0' }}>
        
        {/* SECTION 1: ROLES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 className="rules-section-title">👑 ROLES & POINTS</h4>
          <div className="role-cards-grid">
            {roleKeys.map(r => {
              const def = ROLE_DEFINITIONS[r];
              return (
                <div 
                  key={r}
                  className="role-card-item"
                  style={{
                    '--role-card-border': def.borderColor,
                    '--role-card-bg': def.bgColor
                  } as React.CSSProperties}
                >
                  <RoleIllustration roleType={r} size={64} />
                  <div className="role-card-name">{def.name}</div>
                  <div className="role-card-points">{def.points} PTS</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: PLAYER COUNT */}
        <div className="rules-section">
          <h4 className="rules-section-title">👥 PLAYER COUNT COMBINATIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {playerRoleSets.map(set => (
              <div key={set.count} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E4EAF2',
                fontSize: '14px',
                fontWeight: 700
              }}>
                <span style={{ color: '#172B4D', backgroundColor: '#FFF9ED', padding: '4px 10px', borderRadius: '8px', border: '1px solid #FFC83D' }}>
                  {set.count} PLAYERS
                </span>
                <span style={{ color: '#52627A' }}>{set.combination}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: ROUND FLOW */}
        <div className="rules-section">
          <h4 className="rules-section-title">🔄 ROUND FLOW</h4>
          <ol style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#172B4D',
            paddingLeft: '20px'
          }}>
            <li>Roles are randomly shuffled every round.</li>
            <li>Each player secretly sees only their own role.</li>
            <li>The Police looks at the players and chooses one player as the Thief.</li>
            <li>There are no clues, questioning, or interrogation.</li>
          </ol>
        </div>

        {/* SECTION 4: SCORING */}
        <div className="rules-section">
          <h4 className="rules-section-title">🚨 SCORING</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              backgroundColor: '#E6F9F2',
              border: '2px solid #32C48D',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#172B4D'
            }}>
              <strong style={{ color: '#35B779', display: 'block', marginBottom: '4px', fontSize: '15px' }}>
                If Police correctly identifies the Thief:
              </strong>
              <div>• Police = 200 total points</div>
              <div>• Thief = 0 points</div>
            </div>

            <div style={{
              backgroundColor: '#FEEFEF',
              border: '2px solid #F05252',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#172B4D'
            }}>
              <strong style={{ color: '#F05252', display: 'block', marginBottom: '4px', fontSize: '15px' }}>
                If Police chooses the wrong player:
              </strong>
              <div>• Police = 100 total points</div>
              <div>• Thief = 100 points</div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: '#52627A', marginTop: '4px' }}>
              Other roles receive their normal role points. Scores accumulate across rounds. The player with the highest cumulative score wins!
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};
