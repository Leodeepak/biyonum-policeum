import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  borderColor = 'border-slate-200',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl border-3 ${borderColor} shadow-xl shadow-amber-500/5 p-6 sm:p-8
        transition-all duration-200 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
