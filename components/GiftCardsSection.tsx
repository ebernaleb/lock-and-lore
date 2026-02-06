"use client";

import { Mail, CreditCard, Clock, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const benefits = [
  {
    icon: CreditCard,
    title: "Any Amount",
    description: "Choose any denomination from $25 to $500",
  },
  {
    icon: Mail,
    title: "Digital Delivery",
    description: "Sent instantly via email - perfect for last-minute gifts",
  },
  {
    icon: Clock,
    title: "Never Expires",
    description: "Gift cards are valid for 12 months from purchase date",
  },
];

// ===========================================================================
// === GIFT CARD VISUAL - BLACK CHROME =======================================
// ===========================================================================
//
// A dark chrome card with a reflective multi-stop gradient surface, brushed
// metal conic texture, gradient border, concentric arc decorations, and a
// diagonal light sweep on hover. Think Amex Centurion or Apple Card in dark
// mode with gold accent lighting. Includes an ambient glow that slowly pulses.
//
// ===========================================================================

function GiftCardVisual() {
  return (
    <div className="order-1 lg:order-2 flex justify-center">
      <div className="relative w-full max-w-md group/card">
        {/* Ambient pulsing glow */}
        <div
          className="absolute inset-0 rounded-3xl blur-[60px] scale-115 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(122,92,32,0.35) 0%, rgba(122,92,32,0.08) 50%, transparent 70%)",
            animation: "giftcard-glow-pulse 4s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        {/* Tighter inner glow layer */}
        <div
          className="absolute inset-4 rounded-3xl blur-xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(197,151,62,0.1) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Stacked card behind -- dark with gold edge glow */}
        <div
          className="absolute top-4 left-4 right-4 bottom-0 bg-neutral-950 rounded-2xl rotate-2 pointer-events-none border border-amber-900/15"
          style={{
            boxShadow: "0 0 20px rgba(197,151,62,0.06)",
          }}
          aria-hidden="true"
        />

        {/* Gradient border wrapper */}
        <div
          className="relative rounded-2xl p-px overflow-hidden"
          style={{
            background: "transparent",
          }}
        >
          {/* Main gift card */}
          <div
            className="relative rounded-[calc(1rem-1px)] p-8 sm:p-10 text-white aspect-[3/2] flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover/card:shadow-[0_25px_60px_-12px_rgba(197,151,62,0.2)]"
            style={{
              background:
                "linear-gradient(135deg, #0c0c0c 0%, #141414 25%, #1a1a1a 40%, #141414 55%, #0c0c0c 75%, #0a0a0a 100%)",
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.8)",
            }}
          >
            {/* Top edge highlight -- chrome light catch */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent 10%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 70%, transparent 90%)",
              }}
              aria-hidden="true"
            />

            {/* Brushed metal conic texture */}
            <div
              className="absolute inset-0 giftcard-brushed-metal pointer-events-none"
              aria-hidden="true"
            />

            {/* Noise texture for grain */}
            <div
              className="absolute inset-0 giftcard-noise opacity-[0.02] pointer-events-none mix-blend-overlay"
              aria-hidden="true"
            />

            {/* Concentric arc decorations -- vault/tumbler motif, bottom-left */}
            <div
              className="absolute -bottom-16 -left-16 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="w-48 h-48 rounded-full border"
                style={{ borderColor: "rgba(197,151,62,0.06)" }}
              />
              <div
                className="absolute top-4 left-4 w-40 h-40 rounded-full border"
                style={{ borderColor: "rgba(197,151,62,0.04)" }}
              />
              <div
                className="absolute top-8 left-8 w-32 h-32 rounded-full border"
                style={{ borderColor: "rgba(197,151,62,0.025)" }}
              />
            </div>

            {/* Large keyhole watermark */}
            <div
              className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
              aria-hidden="true"
            >
              {/* Keyhole shape using CSS */}
              <div className="relative w-20 h-28 opacity-[0.04]">
                {/* Circle part of keyhole */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-[3px]"
                  style={{ borderColor: "rgba(197,151,62,0.6)" }}
                />
                {/* Rectangle part of keyhole */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-16 rounded-b-sm"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(197,151,62,0.6), rgba(197,151,62,0.3))",
                  }}
                />
              </div>
            </div>

            {/* ---- Card Content ---- */}

            {/* Top row: Chrome brand text + lock icon */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span
                  className="text-2xl sm:text-3xl font-heading font-bold tracking-wider inline-block"
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #e0e0e0 40%, #a0a0a0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                  }}
                >
                  Lock & Lore
                </span>
                <p
                  className="text-xs mt-1 tracking-[0.25em] uppercase"
                  style={{ color: "rgba(197,151,62,0.4)" }}
                >
                  Escape Rooms
                </p>
              </div>
              <Lock
                className="w-7 h-7 transition-all duration-500 group-hover/card:rotate-[-8deg]"
                style={{
                  color: "rgba(197,151,62,0.25)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              />
            </div>

            {/* Center: Gift Card label + amount with gold backlighting */}
            <div className="text-center relative z-10">
              <p
                className="text-xs tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Gift Card
              </p>
              <div
                className="text-5xl sm:text-6xl font-extrabold text-white inline-block"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
                  letterSpacing: "-0.02em",
                }}
              >
                $50
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between relative z-10">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Valid for any experience
              </p>
              {/* Small chrome accent strip */}
              <div
                className="w-10 h-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, rgba(197,151,62,0.15), rgba(197,151,62,0.5), rgba(197,151,62,0.15))",
                  boxShadow: "0 0 6px rgba(197,151,62,0.1)",
                }}
              />
            </div>

            {/* Hover: diagonal chrome light sweep */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
              aria-hidden="true"
            >
              <div
                className="absolute -inset-full"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.05) 48%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 52%, rgba(255,255,255,0.02) 58%, transparent 70%)",
                  animation: "giftcard-chrome-sweep 0.8s ease-out forwards",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Section Component
// ---------------------------------------------------------------------------

export function GiftCardsSection() {
  return (
    <section className="py-20 sm:py-24 bg-black relative overflow-hidden" id="gift-cards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content (unchanged) */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Give the Gift of <span className="text-primary">Adventure</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg leading-relaxed">
              The perfect gift for birthdays, holidays, anniversaries, or anyone
              who loves a great time. Lock & Lore gift cards are one of our most
              popular items - and a top choice for converting first-time visitors.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
            >
              <span className="relative z-10">Buy a Gift Card</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </Link>
          </div>

          {/* Right: Gift Card Visual */}
          <GiftCardVisual />
        </div>
      </div>
    </section>
  );
}
