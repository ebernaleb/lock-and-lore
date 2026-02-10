"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type SectionTitleVariant =
  | "default"
  | "cinematic"
  | "spotlight"
  | "underline"
  | "outlined"
  | "badge"
  | "minimal";

interface SectionTitleProps {
  variant?: SectionTitleVariant;
  title: string;
  highlight?: string; // Word(s) to highlight with accent color
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant 1: DEFAULT (Current Pattern - Enhanced)
// Simple, clean headline with accent color highlight
// ---------------------------------------------------------------------------

function DefaultTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-12 sm:mb-16 ${className || ""}`}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-heading">
        {highlight ? (
          <>
            {title.replace(highlight, "").trim()}{" "}
            <span className="text-primary">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 2: CINEMATIC TITLE CARD
// Film-inspired title with dramatic side bars and fade-in effect
// Best for: Hero sections, major reveals
// ---------------------------------------------------------------------------

function CinematicTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-16 sm:mb-20 ${className || ""}`}>
      {/* Animated side bars */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
        <div className="h-px w-12 sm:w-20 md:w-32 bg-gradient-to-r from-transparent via-primary to-primary animate-[slideInLeft_0.8s_ease-out]" />
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white font-heading tracking-tight animate-[fadeIn_0.6s_ease-out]">
          {highlight ? (
            <>
              {title.replace(highlight, "").trim()}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-yellow-300">
                {highlight}
              </span>
            </>
          ) : (
            title
          )}
        </h2>
        <div className="h-px w-12 sm:w-20 md:w-32 bg-gradient-to-l from-transparent via-primary to-primary animate-[slideInRight_0.8s_ease-out]" />
      </div>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg leading-relaxed tracking-wide animate-[fadeIn_0.8s_ease-out_0.2s_both]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 3: SPOTLIGHT EFFECT
// Title with glowing backdrop and radial gradient
// Best for: Important sections, CTAs, gift cards
// ---------------------------------------------------------------------------

function SpotlightTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-12 sm:mb-16 relative ${className || ""}`}>
      {/* Radial glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 font-heading leading-tight">
          {highlight ? (
            <>
              {title.replace(highlight, "").trim()}{" "}
              <span className="relative inline-block">
                <span className="text-primary">{highlight}</span>
                <span className="absolute inset-0 blur-lg text-primary opacity-40">{highlight}</span>
              </span>
            </>
          ) : (
            title
          )}
        </h2>

        {subtitle && (
          <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 4: UNDERLINE ACCENT
// Clean title with animated accent underline
// Best for: Features, testimonials, FAQ sections
// ---------------------------------------------------------------------------

function UnderlineTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-12 sm:mb-16 ${className || ""}`}>
      <div className="inline-block">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 font-heading">
          {highlight ? (
            <>
              {title.replace(highlight, "").trim()}{" "}
              <span className="text-primary">{highlight}</span>
            </>
          ) : (
            title
          )}
        </h2>
        {/* Animated underline */}
        <div className="h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full animate-[expandWidth_0.8s_ease-out]" />
      </div>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed mt-5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 5: OUTLINED TEXT
// Dramatic outlined title with solid fill on hover-able accent
// Best for: Hero sections, dramatic reveals, room listings
// ---------------------------------------------------------------------------

function OutlinedTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-12 sm:mb-16 ${className || ""}`}>
      <h2
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 font-heading leading-tight"
        style={{
          WebkitTextStroke: "2px rgba(255, 255, 255, 0.2)",
          color: "transparent",
        }}
      >
        {highlight ? (
          <>
            {title.replace(highlight, "").trim()}{" "}
            <span
              className="transition-all duration-300"
              style={{
                WebkitTextStroke: "2px #FBBD08",
                color: "#FBBD08",
              }}
            >
              {highlight}
            </span>
          </>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 6: BADGE LABEL
// Title with small badge/label above (like "Featured" or "New")
// Best for: Team building, location sections, special announcements
// ---------------------------------------------------------------------------

function BadgeTitle({ title, highlight, subtitle, icon: Icon, className }: Omit<SectionTitleProps, "variant">) {
  return (
    <div className={`text-center mb-12 sm:mb-16 ${className || ""}`}>
      {/* Badge label */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
          Featured Section
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-heading">
        {highlight ? (
          <>
            {title.replace(highlight, "").trim()}{" "}
            <span className="text-primary">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant 7: MINIMAL PREMIUM
// Ultra-clean with strategic whitespace, perfect for premium feel
// Best for: Reviews, FAQ, minimalist sections
// ---------------------------------------------------------------------------

function MinimalTitle({ title, highlight, subtitle, className }: Omit<SectionTitleProps, "variant" | "icon">) {
  return (
    <div className={`text-center mb-16 sm:mb-20 ${className || ""}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Small accent line */}
        <div className="flex justify-center">
          <div className="w-12 h-0.5 bg-primary" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading leading-tight tracking-tight">
          {highlight ? (
            <>
              {title.replace(highlight, "").trim()}{" "}
              <span className="text-primary italic">{highlight}</span>
            </>
          ) : (
            title
          )}
        </h2>

        {subtitle && (
          <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Export Component with Variant Router
// ---------------------------------------------------------------------------

export function SectionTitle({
  variant = "default",
  title,
  highlight,
  subtitle,
  icon,
  className,
}: SectionTitleProps) {
  const props = { title, highlight, subtitle, icon, className };

  switch (variant) {
    case "cinematic":
      return <CinematicTitle {...props} />;
    case "spotlight":
      return <SpotlightTitle {...props} />;
    case "underline":
      return <UnderlineTitle {...props} />;
    case "outlined":
      return <OutlinedTitle {...props} />;
    case "badge":
      return <BadgeTitle {...props} />;
    case "minimal":
      return <MinimalTitle {...props} />;
    case "default":
    default:
      return <DefaultTitle {...props} />;
  }
}

// ---------------------------------------------------------------------------
// Custom Animations (Add to globals.css)
// ---------------------------------------------------------------------------

/*
Add these to globals.css:

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
*/
