import React from 'react';
import { sounds } from '../../utils/sound';

interface OptionSelectorProps<T extends number | string> {
  label: string;
  icon?: React.ReactNode;
  options: T[];
  value: T;
  onChange: (val: T) => void;
  formatOption?: (option: T) => string;
}

export function OptionSelector<T extends number | string>({
  label,
  icon,
  options,
  value,
  onChange,
  formatOption = (opt) => String(opt)
}: OptionSelectorProps<T>) {
  return (
    <div className="game-input-group">
      <div className="game-input-label" style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon} {label}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 800 }}>
          {formatOption(value)}
        </span>
      </div>

      <div className="option-grid">
        {options.map((opt) => {
          const isSelected = opt === value;
          return (
            <button
              type="button"
              key={String(opt)}
              onClick={() => {
                sounds.playClick();
                onChange(opt);
              }}
              className={`option-tile ${isSelected ? 'selected' : ''}`}
            >
              {formatOption(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
