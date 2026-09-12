import React from 'react';
import { Player, RoleType } from '../types/game';
import { ROLE_DEFINITIONS } from '../data/rolesData';
import { ShieldAlert } from 'lucide-react';

interface PlayerAvatarProps {
  player: Player;
  isCurrentPolice?: boolean;
  isSelected?: boolean;
  isCurrentPerspective?: boolean;
  revealedRole?: RoleType;
  onClick?: () => void;
  selectable?: boolean;
  roundScoreGained?: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  isCurrentPolice = false,
  isSelected = false,
  isCurrentPerspective = false,
  revealedRole,
  onClick,
  selectable = false,
  roundScoreGained
}) => {
  const roleDef = revealedRole ? ROLE_DEFINITIONS[revealedRole] : null;

  return (
    <div
      onClick={selectable && onClick ? onClick : undefined}
      className={`
        game-card relative flex items-center justify-between p-4 select-none transition-all duration-200
        ${selectable ? 'cursor-pointer hover:border-amber-400 hover:-translate-y-1' : ''}
        ${isSelected ? 'ring-4 ring-amber-400 bg-amber-50/80 border-amber-500 shadow-lg' : ''}
        ${isCurrentPolice ? 'border-blue-500 bg-blue-50/80' : ''}
        ${isCurrentPerspective ? 'bg-amber-50/50 border-amber-300' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-sm
            ${isSelected ? 'border-amber-500 bg-amber-100' : 'border-slate-200 bg-slate-100'}
          `}>
            {player.avatar || '👤'}
          </div>

          {player.isHost && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 border-2 border-slate-900 rounded-full flex items-center justify-center text-xs font-black shadow" title="Host">
              👑
            </span>
          )}

          {player.isBot && (
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-200 text-slate-700 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold" title="Bot">
              🤖
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-base text-slate-900">{player.name}</h4>
            {isCurrentPerspective && (
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-black uppercase">
                YOU
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-semibold">
            <span>Score: <strong className="text-amber-700 font-mono text-sm">{player.totalScore}</strong></span>
            {roundScoreGained !== undefined && (
              <span className="text-emerald-600 font-bold font-mono">
                +{roundScoreGained}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isCurrentPolice && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 font-extrabold text-xs">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            POLICE
          </span>
        )}

        {roleDef && (
          <span
            className="role-badge text-xs shadow-sm"
            style={{
              backgroundColor: roleDef.bgColor,
              color: roleDef.color,
              borderColor: roleDef.borderColor
            }}
          >
            {roleDef.symbol} {roleDef.name}
          </span>
        )}

        {selectable && !isSelected && (
          <span className="text-xs text-amber-900 font-black px-3 py-1.5 rounded-xl border-2 border-amber-400 bg-amber-100 hover:bg-amber-400 transition-colors">
            SELECT
          </span>
        )}

        {isSelected && (
          <span className="text-xs text-slate-950 font-black px-3 py-1.5 rounded-xl bg-amber-400 border-2 border-amber-500 shadow">
            ACCUSE 🚨
          </span>
        )}
      </div>
    </div>
  );
};
