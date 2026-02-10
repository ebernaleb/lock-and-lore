import Link from "next/link";
import { Ticket, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FinalCTASection() {
  return (
    <section className="py-24 sm:py-32 md:py-36 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Your Next Great Story
          <br />
          <span className="text-primary">Starts Here</span>
        </h2>

        {/* Supporting text */}
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Virginia Beach&apos;s premier escape room experience. Immersive puzzles,
          unforgettable moments, and memories that last a lifetime. Book today
          and discover why thousands of adventurers choose Lock & Lore.
        </p>

        {/* Risk-reversal trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-400" />
            Free cancellation up to 48 hours
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            100% private rooms
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-secondary" />
            Arrive 15 min early
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full uppercase tracking-wide gap-2 w-full sm:w-auto">
            <Link href="/rooms">
              <Ticket className="w-5 h-5" />
              Check Availability
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full uppercase tracking-wide w-full sm:w-auto">
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>

        {/* Micro-copy for urgency */}
        <p className="mt-6 text-xs text-gray-500">
          Limited time slots available. Booking takes less than 2 minutes.
        </p>
      </div>
    </section>
  );
}
