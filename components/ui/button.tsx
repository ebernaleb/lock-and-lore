import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Inner shadow system for polished, premium button feel.
 *
 * Layers (combined via comma-separated box-shadow):
 *   1. Top-edge highlight  -- inset 0 1px 0 rgba(255,255,255,α)  -- simulates light catching the top
 *   2. Inner glow          -- inset 0 0 0 1px rgba(255,255,255,α) -- subtle border-like luminance
 *   3. Bottom-edge depth   -- inset 0 -1px 2px rgba(0,0,0,α)     -- darkened bottom for dimension
 *   4. Outer lift shadow   -- 0 1px 3px rgba(0,0,0,α)            -- grounds the button on the surface
 *
 * Active/pressed state inverts the highlight direction (light moves to bottom,
 * depth moves to top) creating a convincing "pushed in" feel.
 */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium",
    "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-all duration-150 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          // Layered shadow: top highlight + inner glow + bottom depth + outer lift
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_-1px_2px_0_rgba(0,0,0,0.2),0_1px_3px_0_rgba(0,0,0,0.3)]",
          // Hover: intensify the top highlight and outer glow
          "hover:bg-primary/90",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-1px_3px_0_rgba(0,0,0,0.25),0_2px_6px_0_rgba(0,0,0,0.35)]",
          // Active: invert to pressed-in feel
          "active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_0px_0px_0_rgba(0,0,0,0)]",
          "active:translate-y-[1px]",
        ].join(" "),

        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_-1px_2px_0_rgba(0,0,0,0.25),0_1px_3px_0_rgba(0,0,0,0.3)]",
          "hover:bg-destructive/90",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-1px_3px_0_rgba(0,0,0,0.3),0_2px_6px_0_rgba(0,0,0,0.35)]",
          "active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(0,0,0,0.12),inset_0_-1px_0_0_rgba(255,255,255,0.08),0_0px_0px_0_rgba(0,0,0,0)]",
          "active:translate-y-[1px]",
        ].join(" "),

        outline: [
          "border border-input bg-background",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_2px_0_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.2)]",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_-1px_3px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.25)]",
          "active:shadow-[inset_0_2px_3px_0_rgba(0,0,0,0.25),inset_0_-1px_0_0_rgba(255,255,255,0.03),0_0px_0px_0_rgba(0,0,0,0)]",
          "active:translate-y-[1px]",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_-1px_2px_0_rgba(0,0,0,0.2),0_1px_3px_0_rgba(0,0,0,0.3)]",
          "hover:bg-secondary/80",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-1px_3px_0_rgba(0,0,0,0.25),0_2px_6px_0_rgba(0,0,0,0.35)]",
          "active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_0px_0px_0_rgba(0,0,0,0)]",
          "active:translate-y-[1px]",
        ].join(" "),

        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          // Ghost only gets inner shadow on hover to keep it minimal
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_-1px_2px_0_rgba(0,0,0,0.1)]",
          "active:shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.15)]",
          "active:translate-y-[0.5px]",
        ].join(" "),

        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
