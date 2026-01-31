import * as React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    href?: string;
    target?: string;
    rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', href, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-widest uppercase";

        // Variants
        const variants = {
            default: "bg-white text-black hover:bg-gray-200 border border-transparent",
            outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white hover:text-white hover:border-white/40",
            ghost: "hover:bg-accent hover:text-accent-foreground text-gray-300 hover:text-white",
            link: "text-primary underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "h-10 px-8 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-12 rounded-md px-10 text-base",
            icon: "h-10 w-10",
        };

        const Comp = href ? Link : 'button';
        const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

        if (href) {
            return (
                <Link href={href} className={combinedClassName} {...(props as any)}>
                    {props.children}
                </Link>
            )
        }

        return (
            <button
                className={combinedClassName}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
