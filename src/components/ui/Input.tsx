import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="game-input-group">
      {label && (
        <label className="game-input-label">
          {icon} {label}
        </label>
      )}
      <input
        className={`game-input ${className}`}
        {...props}
      />
    </div>
  );
};
