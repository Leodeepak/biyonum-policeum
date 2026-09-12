import React from 'react';
import { RoleType } from '../types/game';
import { ROLE_DEFINITIONS } from '../data/rolesData';
import { RoleIllustration } from './RoleIllustrations';
import { sounds } from '../utils/sound';

interface RoleCardProps {
  roleType: RoleType;
  playerName: string;
  isFlipped: boolean;
  onFlipToggle?: (flipped: boolean) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  roleType,
  playerName,
  isFlipped,
  onFlipToggle
}) => {
  const roleDef = ROLE_DEFINITIONS[roleType];

  const handleCardClick = () => {
    sounds.playFlip();
    if (onFlipToggle) {
      onFlipToggle(!isFlipped);
    }
  };

  return (
    <div 
      className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-flip-inner">
        {/* FRONT OF CARD (SECRET BACKING) */}
        <div className="card-front">
          <div className="card-front-pattern">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-md animate-bounce">
              🕵️‍♂️
            </div>
            <div>
              <span className="text-xs font-black text-amber-800 uppercase tracking-widest block mb-1">
                SECRET ASSIGNMENT
              </span>
              <h3 className="text-xl font-black text-amber-900">
                {playerName}'s Role
              </h3>
            </div>
            <div className="mt-2 px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs border-2 border-amber-500 uppercase tracking-widest shadow">
              Tap to Flip Card 🔄
            </div>
          </div>
        </div>

        {/* BACK OF CARD (REVEALED ROLE WITH CHARACTER ILLUSTRATION) */}
        <div 
          className="card-back"
          style={{
            borderColor: roleDef.borderColor,
            boxShadow: `0 12px 35px -5px ${roleDef.bgColor}`
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-between p-4">
            <div className="w-full text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                YOUR SECRET ROLE
              </span>
              <h2 className="text-3xl font-black" style={{ color: roleDef.color }}>
                {roleDef.name}
              </h2>
            </div>

            {/* Character Illustration SVG Placeholder */}
            <div className="my-auto py-2">
              <RoleIllustration roleType={roleType} size={110} />
            </div>

            <div className="w-full text-center">
              <div 
                className="role-badge mb-3 justify-center mx-auto shadow-sm"
                style={{
                  backgroundColor: roleDef.bgColor,
                  color: roleDef.color,
                  border: `2px solid ${roleDef.borderColor}`
                }}
              >
                ROLE WORTH: {roleDef.points} PTS
              </div>

              <p className="text-xs text-slate-600 font-semibold leading-relaxed px-2">
                {roleDef.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
