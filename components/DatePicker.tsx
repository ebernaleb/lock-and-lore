'use client';

import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export default function DatePicker({ value, onChange, min, max }: DatePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        Select Date <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />

        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          required
          className="
            w-full pl-12 pr-4 py-3 rounded-lg
            bg-neutral-900 text-white
            border border-neutral-700
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-colors
            [color-scheme:dark]
          "
        />
      </div>

      <p className="text-xs text-neutral-400">
        Select a date to view available time slots
      </p>
    </div>
  );
}
