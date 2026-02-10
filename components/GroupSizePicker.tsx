'use client';

import { Minus, Plus, Users } from 'lucide-react';

interface GroupSizePickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export default function GroupSizePicker({
  value,
  onChange,
  min,
  max,
}: GroupSizePickerProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        Group Size <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
        <Users className="w-5 h-5 text-neutral-400" />

        <div className="flex items-center gap-4 flex-1">
          <button
            type="button"
            onClick={() => canDecrement && onChange(value - 1)}
            disabled={!canDecrement}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-colors
              ${
                canDecrement
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
              }
            `}
            aria-label="Decrease group size"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-neutral-400">
              {value === 1 ? 'player' : 'players'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => canIncrement && onChange(value + 1)}
            disabled={!canIncrement}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-colors
              ${
                canIncrement
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
              }
            `}
            aria-label="Increase group size"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        This room accommodates {min}-{max} players
      </p>
    </div>
  );
}
