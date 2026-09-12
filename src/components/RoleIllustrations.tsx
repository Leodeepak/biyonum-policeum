import React from 'react';
import { RoleType } from '../types/game';

interface RoleIllustrationProps {
  roleType: RoleType;
  className?: string;
  size?: number;
}

export const RoleIllustration: React.FC<RoleIllustrationProps> = ({
  roleType,
  className = '',
  size = 80
}) => {
  switch (roleType) {
    case 'king':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FFF8E1" stroke="#FFC83D" strokeWidth="4" />
          <path d="M25 65L30 35L42 50L50 30L58 50L70 35L75 65H25Z" fill="#FFC83D" stroke="#172B4D" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="30" cy="35" r="4" fill="#F05252" />
          <circle cx="50" cy="30" r="4.5" fill="#4D8DFF" />
          <circle cx="70" cy="35" r="4" fill="#F05252" />
          <rect x="25" y="65" width="50" height="8" rx="3" fill="#172B4D" />
        </svg>
      );

    case 'queen':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FDEBF7" stroke="#F15BB5" strokeWidth="4" />
          <path d="M28 65C28 65 32 38 40 45C45 32 55 32 60 45C68 38 72 65 72 65H28Z" fill="#F15BB5" stroke="#172B4D" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="32" r="5" fill="#FFC83D" />
          <circle cx="40" cy="42" r="3.5" fill="#8B5CF6" />
          <circle cx="60" cy="42" r="3.5" fill="#8B5CF6" />
          <rect x="28" y="65" width="44" height="6" rx="3" fill="#172B4D" />
        </svg>
      );

    case 'minister':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="4" />
          <rect x="32" y="28" width="36" height="46" rx="5" fill="#FFF" stroke="#8B5CF6" strokeWidth="3" />
          <line x1="38" y1="38" x2="62" y2="38" stroke="#172B4D" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="48" x2="58" y2="48" stroke="#172B4D" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="58" x2="52" y2="58" stroke="#172B4D" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 62C68 50 72 30 72 30C72 30 62 38 58 48" fill="#8B5CF6" stroke="#172B4D" strokeWidth="2" />
        </svg>
      );

    case 'soldier':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FFF0E6" stroke="#FF8A3D" strokeWidth="4" />
          <path d="M50 25C65 25 72 30 72 50C72 68 50 78 50 78C50 78 28 68 28 50C28 30 35 25 50 25Z" fill="#FF8A3D" stroke="#172B4D" strokeWidth="3" />
          <path d="M50 32V70" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 48H62" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'slave':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#E6F9F2" stroke="#32C48D" strokeWidth="4" />
          <rect x="44" y="42" width="12" height="34" rx="3" fill="#172B4D" />
          <rect x="28" y="28" width="44" height="18" rx="4" fill="#32C48D" stroke="#172B4D" strokeWidth="3" />
          <circle cx="36" cy="37" r="2.5" fill="#FFF" />
          <circle cx="64" cy="37" r="2.5" fill="#FFF" />
        </svg>
      );

    case 'police':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#EBF2FF" stroke="#4D8DFF" strokeWidth="4" />
          <path d="M50 24L72 34V52C72 66 50 76 50 76C50 76 28 66 28 52V34L50 24Z" fill="#4D8DFF" stroke="#172B4D" strokeWidth="3" />
          <polygon points="50,36 53,44 61,44 55,49 57,57 50,52 43,57 45,49 39,44 47,44" fill="#FFC83D" />
        </svg>
      );

    case 'thief':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FEEFEF" stroke="#F05252" strokeWidth="4" />
          <path d="M26 44C26 38 36 36 50 36C64 36 74 38 74 44C74 50 64 54 50 54C36 54 26 50 26 44Z" fill="#172B4D" stroke="#0F172A" strokeWidth="2" />
          <circle cx="38" cy="44" r="4" fill="#FFF" />
          <circle cx="62" cy="44" r="4" fill="#FFF" />
          <circle cx="39" cy="44" r="2" fill="#172B4D" />
          <circle cx="63" cy="44" r="2" fill="#172B4D" />
          <path d="M40 60C40 60 42 74 50 74C58 74 60 60 60 60H40Z" fill="#F05252" />
        </svg>
      );

    default:
      return null;
  }
};
