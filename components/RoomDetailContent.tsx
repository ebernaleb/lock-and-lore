"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Lock,
  ArrowLeft,
  Shield,
  ChevronRight,
  Calendar,
  Info,
} from "lucide-react";
import type { OTCGame } from "@/types/otc-api";
import {
  getDifficultyLabel,
  getDifficultyLevel,
  formatPlayerCount,
  formatDuration,
  stripHtml,
  generateSlug,
} from "@/lib/game-utils";

interface RoomDetailContentProps {
  game: OTCGame;
  imageUrl: string;
}

function DifficultyMeter({ level }: { level: number }) {
  const maxLevel = 5;
  return (
    <div className="flex gap-1" role="img" aria-label={`Difficulty ${level} out of ${maxLevel}`}>
      {Array.from({ length: maxLevel }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-full transition-colors duration-300 ${
            i < level ? "bg-primary" : "bg-neutral-700"
          }`}
        />
      ))}
    </div>
  );
}

function BookNowButton({ gameName, gameSlug }: { gameName: string; gameSlug: string }) {
  return (
    <Link
      href={`/rooms/${gameSlug}/book`}
      className="w-full bg-primary hover:bg-primary-dark text-neutral-950 font-semibold py-3.5 text-sm rounded-lg transition-colors duration-200 uppercase tracking-widest flex items-center justify-center gap-2"
      aria-label={`Book ${gameName} now`}
    >
      <Calendar className="w-4 h-4" />
      <span>Book Now</span>
    </Link>
  );
}

export function RoomDetailContent({ game, imageUrl }: RoomDetailContentProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const difficultyLabel = getDifficultyLabel(game.difficulty);
  const difficultyLevel = getDifficultyLevel(game.difficulty);
  const playerCount = formatPlayerCount(game);
  const duration = formatDuration(game.duration);

  const heroImageUrl = imageError ? "/images/hero_img.png" : imageUrl;

  return (
    <>
      {/* Hero Image Section */}
      <section className="relative">
        <div className="relative h-[44vh] md:h-[52vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-neutral-400 mb-5">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                <Link href="/rooms" className="hover:text-white transition-colors">
                  Rooms
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-white">{game.name}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-5 tracking-tight">
                {game.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-neutral-500" />
                  {playerCount}
                </span>
                <span className="w-px h-4 bg-neutral-700" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  {duration}
                </span>
                <span className="w-px h-4 bg-neutral-700" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  {difficultyLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <article className="bg-neutral-900 rounded-xl p-8 md:p-10 border border-neutral-800">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1 h-7 rounded-full bg-primary flex-shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                  About This Room
                </h2>
              </div>
              <p className="text-neutral-400 leading-relaxed text-base">
                {stripHtml(game.description) || "Prepare for an exciting escape room experience. Work together with your team to solve puzzles, find clues, and escape before time runs out."}
              </p>
            </article>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-800 rounded-xl overflow-hidden border border-neutral-800">
              {/* Players */}
              <div className="bg-neutral-900 p-5 flex flex-col items-center text-center">
                <Users className="w-5 h-5 text-neutral-500 mb-3" />
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Players</p>
                <p className="text-lg font-semibold text-white">{game.min_players ?? 2}-{game.max_players ?? 10}</p>
              </div>

              {/* Duration */}
              <div className="bg-neutral-900 p-5 flex flex-col items-center text-center">
                <Clock className="w-5 h-5 text-neutral-500 mb-3" />
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-lg font-semibold text-white">{game.duration ?? 60} min</p>
              </div>

              {/* Difficulty */}
              <div className="bg-neutral-900 p-5 flex flex-col items-center text-center">
                <Lock className="w-5 h-5 text-neutral-500 mb-3" />
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Difficulty</p>
                <p className="text-lg font-semibold text-white mb-2">{difficultyLabel}</p>
                <DifficultyMeter level={difficultyLevel} />
              </div>

              {/* Experience */}
              <div className="bg-neutral-900 p-5 flex flex-col items-center text-center">
                <Shield className="w-5 h-5 text-neutral-500 mb-3" />
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Experience</p>
                <p className="text-lg font-semibold text-white">Private</p>
              </div>
            </div>


          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                {/* Primary accent bar */}
                <div className="h-1 bg-primary" />

                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-neutral-800">
                  <h3 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
                    Book This Room
                  </h3>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-5">
                  {/* Quick Info */}
                  <div className="space-y-0">
                    {[
                      { icon: Users, label: playerCount },
                      { icon: Clock, label: duration },
                      { icon: Lock, label: `${difficultyLabel} difficulty` },
                      { icon: Shield, label: "Private experience" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 text-neutral-400 py-3 border-b border-neutral-800/60 last:border-b-0"
                      >
                        <Icon className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Deposit Info */}
                  {game.deposit_required === 1 && game.deposit_amount && (
                    <div className="bg-neutral-800 rounded-lg p-3.5 border border-neutral-700/50">
                      <p className="text-xs text-neutral-400 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                        <span>
                          <span className="font-medium text-neutral-300">Deposit required:</span>{" "}
                          ${game.deposit_amount.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <BookNowButton gameName={game.name} gameSlug={generateSlug(game.name)} />

                  <p className="text-xs text-neutral-600 text-center">
                    Free cancellation up to 24 hours in advance
                  </p>
                </div>
              </div>

              {/* Back link */}
              <div className="mt-5 text-center">
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  View all rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
