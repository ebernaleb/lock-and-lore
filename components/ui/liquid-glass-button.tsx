"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
   Button - Standard button with polished variants
   --------------------------------------------------------------------------- */

const buttonVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    // Typography
    "text-sm font-semibold tracking-wide",
    // Shape
    "rounded-lg",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transitions - unified timing for all interactive properties
    "transition-all duration-200 ease-out",
    // Focus - accessible ring with primary color glow
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-40 disabled:saturate-50",
    // SVG children
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-black font-bold",
          "shadow-md shadow-primary/15",
          "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-[1px]",
          "active:translate-y-[1px] active:shadow-sm active:bg-primary/80",
        ].join(" "),
        destructive: [
          "bg-red-600 text-white",
          "shadow-md shadow-red-600/15",
          "hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/25 hover:-translate-y-[1px]",
          "active:translate-y-[1px] active:shadow-sm active:bg-red-700",
          "focus-visible:ring-red-500/60",
        ].join(" "),
        cool: [
          "bg-gradient-to-b from-primary to-primary/85 text-black font-bold",
          "border border-primary/30",
          "shadow-md shadow-primary/20",
          "ring-1 ring-inset ring-white/15",
          "hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-[1px]",
          "active:brightness-90 active:translate-y-[1px] active:shadow-sm",
        ].join(" "),
        outline: [
          "border border-neutral-600 bg-transparent text-white",
          "hover:border-primary/60 hover:bg-primary/5 hover:text-primary",
          "active:bg-primary/10 active:border-primary/80",
        ].join(" "),
        secondary: [
          "bg-neutral-800 text-neutral-100 border border-neutral-700",
          "hover:bg-neutral-700 hover:border-neutral-600 hover:-translate-y-[1px]",
          "active:bg-neutral-800 active:translate-y-[1px]",
        ].join(" "),
        ghost: [
          "bg-transparent text-neutral-300",
          "hover:bg-white/5 hover:text-white",
          "active:bg-white/10",
        ].join(" "),
        link: [
          "bg-transparent text-primary p-0 h-auto",
          "underline-offset-4 decoration-primary/40 decoration-1",
          "hover:underline hover:decoration-primary/80",
          "active:text-primary/80",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-8 text-base rounded-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

/* ---------------------------------------------------------------------------
   LiquidButton - Glassmorphism button with refined distortion effect
   --------------------------------------------------------------------------- */

const liquidbuttonVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    // Typography
    "text-sm font-semibold tracking-wider uppercase",
    // Shape
    "rounded-full",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transitions
    "transition-all duration-300 ease-out",
    // Focus
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-40 disabled:saturate-50",
    // SVG children
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent text-primary hover:text-white",
        destructive: [
          "bg-red-600/80 text-white",
          "hover:bg-red-500/90",
          "focus-visible:ring-red-500/60",
        ].join(" "),
        outline: [
          "border border-neutral-600 bg-transparent text-white",
          "hover:border-primary/60 hover:text-primary",
        ].join(" "),
        secondary: [
          "bg-neutral-800/60 text-neutral-100",
          "hover:bg-neutral-700/60",
        ].join(" "),
        ghost: [
          "bg-transparent text-neutral-300",
          "hover:text-white",
        ].join(" "),
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-full px-8 has-[>svg]:px-6",
        xxl: "h-14 rounded-full px-10 has-[>svg]:px-8 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
    },
  }
)

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Comp
      data-slot="button"
      className={cn(
        "group relative",
        liquidbuttonVariants({ variant, size, className })
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      {...props}
    >
      {/* Outer glow on hover */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-primary, #FBBD08) 0%, transparent 70%)",
          filter: "blur(10px)",
          opacity: isHovered ? 0.2 : 0,
          transition: "opacity 500ms ease",
        }}
      />

      {/* Glass container with refined shadow layers */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          boxShadow: [
            // Outer ambient shadow
            "0 2px 8px rgba(0,0,0,0.25)",
            // Outer glow (subtle primary)
            `0 0 16px rgba(251,189,8,${isHovered ? 0.12 : 0.04})`,
            // Inner highlight - top edge
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            // Inner shadow - bottom edge for depth
            "inset 0 -1px 0 rgba(0,0,0,0.2)",
            // Inner light diffusion
            "inset 0 0 12px rgba(255,255,255,0.04)",
          ].join(", "),
          transition: "box-shadow 400ms ease",
        }}
      />

      {/* Glass distortion backdrop */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-full isolate"
        style={{ backdropFilter: 'url("#liquid-glass-filter") blur(1px)' }}
      />

      {/* Subtle inner border */}
      <div className="absolute inset-0 rounded-full border border-white/[0.06] pointer-events-none" />

      {/* Content */}
      <span className="relative z-10 pointer-events-none flex items-center gap-2">
        {children}
      </span>

      <GlassFilter />
    </Comp>
  )
}

function GlassFilter() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Gentle turbulence for organic glass distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="2"
            seed="3"
            result="turbulence"
          />
          {/* Soften the noise */}
          <feGaussianBlur in="turbulence" stdDeviation="3" result="blurredNoise" />
          {/* Subtle displacement - much less aggressive than before */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          {/* Light final blur for frosted glass look */}
          <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

/* ---------------------------------------------------------------------------
   MetalButton - Premium forged metal button with layered depth
   --------------------------------------------------------------------------- */

type ColorVariant =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "gold"
  | "bronze"

interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string
    inner: string
    button: string
    textColor: string
    textShadow: string
    glowColor: string
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#1a1a1a] to-[#909090]",
    inner: "bg-gradient-to-b from-[#E8E8E8] via-[#3A3A3A] to-[#D0D0D0]",
    button: "bg-gradient-to-b from-[#B0B0B0] via-[#A0A0A0] to-[#8A8A8A]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]",
    glowColor: "rgba(180,180,180,0.15)",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#2a1800] to-[#FBBD08]",
    inner: "bg-gradient-to-b from-[#FFE88A] via-[#7A5500] to-[#FFD54F]",
    button: "bg-gradient-to-b from-[#FBBD08] via-[#E5AB00] to-[#C49200]",
    textColor: "text-black",
    textShadow: "[text-shadow:_0_1px_0_rgba(255,255,255,0.3)]",
    glowColor: "rgba(251,189,8,0.25)",
  },
  success: {
    outer: "bg-gradient-to-b from-[#003D2E] to-[#6DBF99]",
    inner: "bg-gradient-to-b from-[#D4F0E5] via-[#00352F] to-[#C1E8D8]",
    button: "bg-gradient-to-b from-[#8ED4B8] via-[#6BBF9D] to-[#3E8F7C]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_1px_2px_rgb(6_78_59_/_50%)]",
    glowColor: "rgba(110,191,153,0.2)",
  },
  error: {
    outer: "bg-gradient-to-b from-[#4A0000] to-[#E88A8C]",
    inner: "bg-gradient-to-b from-[#FFD0D0] via-[#5C0002] to-[#FFDBDB]",
    button: "bg-gradient-to-b from-[#E07072] via-[#CD5E60] to-[#A45253]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_1px_2px_rgb(80_0_0_/_50%)]",
    glowColor: "rgba(224,112,114,0.2)",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#6B5300] to-[#D4B76A]",
    inner: "bg-gradient-to-b from-[#FFF4C8] via-[#7A6010] to-[#FFE88A]",
    button: "bg-gradient-to-b from-[#FFE08A] via-[#E8C84A] to-[#9B873F]",
    textColor: "text-[#3D2E00]",
    textShadow: "[text-shadow:_0_1px_0_rgba(255,255,255,0.25)]",
    glowColor: "rgba(255,224,138,0.2)",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#6B3810] to-[#D4A070]",
    inner: "bg-gradient-to-b from-[#E8C0A0] via-[#5F2D01] to-[#F0D4B8]",
    button: "bg-gradient-to-b from-[#F0D0B0] via-[#D4A878] to-[#A36F3D]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_1px_2px_rgb(95_45_1_/_50%)]",
    glowColor: "rgba(208,160,112,0.2)",
  },
}

const getMetalButtonStyles = (
  variant: ColorVariant = "default",
  isPressed: boolean,
  isHovered: boolean,
  isFocused: boolean,
) => {
  const colors = colorVariants[variant]
  const ease = "cubic-bezier(0.22, 0.61, 0.36, 1)"

  return {
    wrapper: cn(
      "relative inline-flex rounded-lg p-[1.5px] transform-gpu will-change-transform",
      colors.outer,
    ),
    wrapperStyle: {
      transform: isPressed
        ? "translateY(2px) scale(0.985)"
        : isHovered
          ? "translateY(-1px) scale(1.005)"
          : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? `0 1px 3px rgba(0,0,0,0.2), 0 0 0 0 ${colors.glowColor}`
        : isHovered
          ? `0 6px 20px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15), 0 0 20px ${colors.glowColor}`
          : `0 3px 10px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)`,
      transition: `transform 250ms ${ease}, box-shadow 350ms ${ease}`,
      // Focus ring
      outline: isFocused ? `2px solid var(--color-primary, #FBBD08)` : "none",
      outlineOffset: isFocused ? "2px" : "0",
    },
    inner: cn(
      "absolute inset-[1px] rounded-[7px] transform-gpu will-change-transform",
      colors.inner,
    ),
    innerStyle: {
      transition: `filter 300ms ${ease}`,
      filter: isHovered && !isPressed ? "brightness(1.08)" : "brightness(1)",
    },
    button: cn(
      "relative z-10 m-[1px] rounded-md inline-flex h-11 transform-gpu items-center justify-center overflow-hidden px-6 py-2 text-sm font-bold tracking-wide leading-none will-change-transform",
      "cursor-pointer outline-none",
      "disabled:opacity-40 disabled:pointer-events-none disabled:saturate-50",
      colors.button,
      colors.textColor,
      colors.textShadow,
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: `transform 200ms ${ease}, filter 300ms ${ease}`,
      filter: isHovered && !isPressed ? "brightness(1.04)" : "brightness(1)",
    },
  }
}

/* Sweep shine effect that triggers on hover */
const ShineEffect = ({
  isHovered,
  isPressed,
}: {
  isHovered: boolean
  isPressed: boolean
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-md"
      aria-hidden="true"
    >
      <div
        className="absolute -inset-full"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)",
          transform: isHovered && !isPressed
            ? "translateX(200%)"
            : "translateX(-200%)",
          transition: isHovered
            ? "transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)"
            : "transform 0ms",
        }}
      />
      {/* Pressed state dim overlay */}
      <div
        className="absolute inset-0 rounded-md bg-black/10"
        style={{
          opacity: isPressed ? 1 : 0,
          transition: "opacity 150ms ease",
        }}
      />
    </div>
  )
}

/* Top highlight gradient for depth perception */
const TopHighlight = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 rounded-md"
      aria-hidden="true"
      style={{
        background: "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 50%)",
        opacity: isHovered ? 1 : 0.6,
        transition: "opacity 300ms ease",
      }}
    />
  )
}

export const MetalButton = React.forwardRef<
  HTMLButtonElement,
  MetalButtonProps
>(({ children, className, variant = "default", disabled, ...props }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const buttonText = children || "Button"
  const styles = getMetalButtonStyles(
    variant,
    isPressed && !disabled,
    isHovered && !disabled,
    isFocused && !disabled,
  )

  return (
    <div
      className={styles.wrapper}
      style={styles.wrapperStyle}
      aria-disabled={disabled || undefined}
    >
      <div className={styles.inner} style={styles.innerStyle} />
      <button
        ref={ref}
        className={cn(styles.button, className)}
        style={styles.buttonStyle}
        disabled={disabled}
        {...props}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsPressed(false)
          setIsHovered(false)
        }}
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setIsPressed(false)
        }}
      >
        <ShineEffect isHovered={isHovered} isPressed={isPressed} />
        <TopHighlight isHovered={isHovered} />
        <span className="relative z-30">{buttonText}</span>
      </button>
    </div>
  )
})

MetalButton.displayName = "MetalButton"

/* ---------------------------------------------------------------------------
   Exports
   --------------------------------------------------------------------------- */

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }
