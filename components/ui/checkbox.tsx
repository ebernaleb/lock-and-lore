'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-3 group">
        <div className="relative flex items-center justify-center min-w-[24px] min-h-[24px] pt-1">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer h-6 w-6 shrink-0 rounded border-2 border-white/30 bg-zinc-900",
              "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "cursor-pointer transition-all duration-200",
              "appearance-none",
              className
            )}
            {...props}
          />
          <Check
            className="absolute w-4 h-4 text-primary pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            strokeWidth={3}
          />
        </div>
        {(label || description) && (
          <label
            htmlFor={checkboxId}
            className="flex-1 cursor-pointer select-none"
          >
            {label && (
              <span className="text-sm text-white/90 leading-relaxed block">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-white/50 leading-relaxed block mt-1">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
