"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A sticky booking CTA that appears on mobile devices after the user scrolls
 * past the hero section. Provides a persistent, easy-to-tap booking button
 * to reduce friction to conversion on mobile.
 *
 * The button hides when the user scrolls near the footer to avoid obstructing
 * contact/footer content.
 */
export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Show after scrolling past 400px (past the hero CTA)
        const pastHero = scrollY > 400;
        // Hide when near the bottom (footer area)
        const nearBottom = scrollY + viewportHeight > docHeight - 300;

        setIsVisible(pastHero && !nearBottom);
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      role="complementary"
      aria-label="Quick booking"
    >
      {/* Fade gradient above the bar for a polished look */}
      <div
        className="h-4 bg-gradient-to-t from-black to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div className="bg-black px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
        <Link
          href="/rooms"
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide"
        >
          <Ticket className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Check Availability</span>
        </Link>
      </div>
    </div>
  );
}
