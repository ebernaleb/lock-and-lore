"use client";

import { Star, Quote, Users, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Review Data
// ---------------------------------------------------------------------------

const reviews = [
  {
    name: "Sarah Jenkins",
    date: "2 days ago",
    rating: 5,
    text: "Absolutely amazing experience! The 'Skybound Dynasty' room was so detailed and fun. Our game master was fantastic and made us feel like real adventurers!",
    avatar: "S",
    source: "Google",
    room: "Skybound Dynasty",
  },
  {
    name: "Mike T.",
    date: "1 week ago",
    rating: 5,
    text: "We did the Echo Chamber for my daughter's birthday. Best party ever! The puzzles were challenging but fair, and the staff went above and beyond.",
    avatar: "M",
    source: "Google",
    room: "Echo Chamber",
  },
  {
    name: "The Travelers",
    date: "3 weeks ago",
    rating: 5,
    text: "We've done escape rooms all over the country, and Lock & Lore ranks in the top 5! High production value, incredible set design, and the story actually matters.",
    avatar: "T",
    source: "Google",
    room: "Escape the Simulation",
  },
  {
    name: "Jessica & Team",
    date: "1 month ago",
    rating: 5,
    text: "Brought our whole office team of 8 for a team-building event. Everyone was engaged and had a blast. Already planning our next visit!",
    avatar: "J",
    source: "Google",
    room: "Skybound Dynasty",
  },
  {
    name: "David R.",
    date: "2 weeks ago",
    rating: 5,
    text: "The attention to detail in every room is insane. You can tell the creators are passionate about what they do. Worth every penny!",
    avatar: "D",
    source: "Google",
    room: "Echo Chamber",
  },
  {
    name: "The Chen Family",
    date: "5 days ago",
    rating: 5,
    text: "Family-friendly and genuinely fun for all ages. Our kids (10 and 13) were completely immersed. We escaped with 3 minutes to spare!",
    avatar: "C",
    source: "Google",
    room: "Skybound Dynasty",
  },
];

// ---------------------------------------------------------------------------
// Aggregate Stats
// ---------------------------------------------------------------------------

const stats = {
  averageRating: 4.9,
  totalReviews: 200,
  escapeRate: 47,
  groupsServed: "2,500+",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-neutral-700 fill-neutral-700"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-20 sm:py-24 bg-black relative" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by <span className="text-primary">Thousands</span> of
            Adventurers
          </h2>
          <p className="max-w-xl mx-auto text-gray-400">
            See why groups, families, and teams keep coming back for more.
          </p>
        </div>

        {/* Aggregate trust bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {stats.averageRating}
              </span>
            </div>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <ThumbsUp className="w-6 h-6 text-primary" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {stats.totalReviews}+
              </span>
            </div>
            <p className="text-sm text-gray-500">5-Star Reviews</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {stats.groupsServed}
              </span>
            </div>
            <p className="text-sm text-gray-500">Groups Served</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-5 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {stats.escapeRate}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Escape Rate</p>
          </div>
        </div>

        {/* Reviews grid - 2 cols on tablet, 3 on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-neutral-900 p-6 rounded-2xl flex flex-col gap-3 hover:bg-neutral-800 transition-colors duration-300"
            >
              {/* Review header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">
                    {review.name}
                  </h4>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <span className="text-xs font-semibold text-gray-400 flex-shrink-0">
                  {review.source}
                </span>
              </div>

              {/* Stars */}
              <StarRating rating={review.rating} />

              {/* Review text */}
              <div className="relative">
                <Quote
                  className="absolute -top-1 -left-1 w-5 h-5 text-primary/10"
                  aria-hidden="true"
                />
                <p className="text-gray-300 text-sm leading-relaxed pl-4">
                  {review.text}
                </p>
              </div>

              {/* Room tag */}
              <div className="mt-auto pt-2">
                <span className="inline-block text-xs font-medium text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full">
                  {review.room}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <Button asChild size="lg" className="rounded-full uppercase tracking-wide">
            <Link href="/rooms">
              Check Availability
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
