import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-white/80 mb-2 tracking-wide",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
    );
  }
);
Label.displayName = 'Label';

export { Label };
