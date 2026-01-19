import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md bg-zinc-900 border-2 border-white/20 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[48px]", // Touch-friendly
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
