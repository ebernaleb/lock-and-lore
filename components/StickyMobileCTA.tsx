"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <Button asChild size="lg" className="w-full rounded-full uppercase tracking-wide gap-2">
          <Link href="/book">
            <Ticket className="w-5 h-5" />
            Check Availability
          </Link>
        </Button>
      </div>
    </div>
  );
}
