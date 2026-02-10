"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Selling points -- concise, scannable bullets
// ---------------------------------------------------------------------------

const highlights = [
  "Private rooms for groups of 2 -- 10 players",
  "Dedicated Game Master for every session",
  "Custom packages for corporate events",
  "No experience required -- just teamwork",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TeamBuildingSection() {
  return (
    <section
      className="py-24 sm:py-32 md:py-36 bg-black relative overflow-hidden"
      id="team-building"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ---------------------------------------------------------------
              Left Column: Text Content
          --------------------------------------------------------------- */}
          <div className="order-2 lg:order-1">
            {/* Eyebrow label */}
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4">
              Corporate &amp; Group Events
            </p>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Elevate Your Next{" "}
              <span className="text-primary">Team Event</span>
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Transform ordinary team outings into unforgettable experiences. Our
              private escape rooms foster collaboration, communication, and
              camaraderie in ways a conference room never could.
            </p>

            {/* Highlight checklist */}
            <ul className="space-y-3 mb-10" role="list">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-300 text-sm sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="rounded-full uppercase tracking-wide gap-2"
            >
              <Link href="/contact">
                Plan Your Event
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* ---------------------------------------------------------------
              Right Column: Image
          --------------------------------------------------------------- */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Subtle accent glow behind the image */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--color-primary) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Image container with rounded corners and subtle border */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800">
                <Image
                  src="/images/teambuilding_2.png"
                  alt="Team collaborating together during an escape room challenge"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  priority={false}
                />

                {/* Bottom gradient overlay for depth */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
