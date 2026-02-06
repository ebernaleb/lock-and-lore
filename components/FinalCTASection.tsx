import Link from "next/link";
import { Ticket, Shield, Users, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FinalCTASection() {
  return (
    <section className="py-20 sm:py-24 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

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
          <Link
            href="/rooms"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide w-full sm:w-auto"
          >
            <Ticket className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Check Availability</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none uppercase tracking-wide w-full sm:w-auto"
          >
            <span className="relative z-10">Contact Us</span>
          </Link>
        </div>

        {/* Micro-copy for urgency */}
        <p className="mt-6 text-xs text-gray-500">
          Limited time slots available. Booking takes less than 2 minutes.
        </p>
      </div>
    </section>
  );
}
