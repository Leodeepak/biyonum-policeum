import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'create' | 'join' | 'secondary' | 'danger';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'create',
  fullWidth = true,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = {
    create: 'btn-create',
    join: 'btn-join',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`btn-base ${variantClass} ${className}`}
      style={{ width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {children}
    </button>
  );
};
