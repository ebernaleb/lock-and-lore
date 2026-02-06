"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Lock,
  ArrowLeft,
  DollarSign,
  Star,
  Shield,
  MapPin,
  ChevronRight,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import type { OTCGame } from "@/types/otc-api";
import {
  getDifficultyLabel,
  getDifficultyLevel,
  getDifficultyColor,
  formatPlayerCount,
  formatDuration,
  getGamePriceDisplay,
  getPricingTypeLabel,
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
    <div className="flex gap-1.5" role="img" aria-label={`Difficulty ${level} out of ${maxLevel}`}>
      {Array.from({ length: maxLevel }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 w-7 rounded-full transition-all duration-500 ${
            i < level
              ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_6px_rgba(197,151,62,0.4)]"
              : "bg-neutral-700/60"
          }`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

function BookNowButton({ gameName, gameSlug }: { gameName: string; gameSlug: string }) {
  return (
    <Link
      href={`/rooms/${gameSlug}/book`}
      className="w-full bg-primary hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none uppercase tracking-wide flex items-center justify-center gap-2"
      aria-label={`Book ${gameName} now`}
    >
      <Calendar className="w-5 h-5 relative z-10" />
      <span className="relative z-10">Book Now</span>
    </Link>
  );
}

export function RoomDetailContent({ game, imageUrl }: RoomDetailContentProps) {
  const [imageError, setImageError] = useState(false);

  // Ensure page starts at the top when this component mounts.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const difficultyLabel = getDifficultyLabel(game.difficulty);
  const difficultyLevel = getDifficultyLevel(game.difficulty);
  const difficultyColorClass = getDifficultyColor(game.difficulty);
  const playerCount = formatPlayerCount(game);
  const duration = formatDuration(game.duration);
  const priceDisplay = getGamePriceDisplay(game);
  const pricingTypeLabel = getPricingTypeLabel(game.pricing_type);

  const heroImageUrl = imageError ? "/images/hero_img.png" : imageUrl;

  return (
    <>
      {/* Hero Image Section */}
      <section className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url('${heroImageUrl}')`,
              filter: 'blur(2px)'
            }}
          >
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 pb-24 md:pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/90 drop-shadow-lg mb-4">
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href="/rooms"
                  className="hover:text-white transition-colors"
                >
                  Rooms
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium">{game.name}</span>
              </nav>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-4 drop-shadow-lg">
                {game.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-4 rounded-full">
                  <Users className="w-4 h-4" />
                  {playerCount}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-4 rounded-full">
                  <Clock className="w-4 h-4" />
                  {duration}
                </span>
                <span className={`inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-4 rounded-full`}>
                  <Lock className="w-4 h-4" />
                  {difficultyLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="group relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-10 border border-neutral-800/80 shadow-2xl shadow-black/40 hover:border-neutral-700/80 transition-all duration-500 overflow-hidden">
              {/* Subtle decorative gradient glow in top-left corner */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-secondary/8 transition-colors duration-700" />

              <h2 className="relative text-2xl font-bold font-heading text-white mb-5 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 shadow-lg shadow-secondary/10">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </span>
                About This Room
              </h2>
              <p className="relative text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                {stripHtml(game.description) || "Prepare for an exciting escape room experience. Work together with your team to solve puzzles, find clues, and escape before time runs out."}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Players */}
              <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30 hover:border-blue-500/30 hover:shadow-blue-500/5 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/15 flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:shadow-blue-500/10 group-hover:border-blue-500/25 transition-all duration-500">
                    <Users className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Players</p>
                    <p className="text-xl font-bold text-white mt-1.5">{game.min_players ?? 2} - {game.max_players ?? 10}</p>
                    <p className="text-sm text-gray-500 mt-1">people per session</p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30 hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/15 flex items-center justify-center shadow-lg shadow-emerald-500/5 group-hover:shadow-emerald-500/10 group-hover:border-emerald-500/25 transition-all duration-500">
                    <Clock className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</p>
                    <p className="text-xl font-bold text-white mt-1.5">{game.duration ?? 60} min</p>
                    <p className="text-sm text-gray-500 mt-1">total experience</p>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30 hover:border-amber-500/30 hover:shadow-amber-500/5 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/15 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:shadow-amber-500/10 group-hover:border-amber-500/25 transition-all duration-500">
                    <Lock className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</p>
                    <p className="text-xl font-bold text-white mt-1.5">{difficultyLabel}</p>
                    <div className="mt-2.5">
                      <DifficultyMeter level={difficultyLevel} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Type */}
              <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30 hover:border-purple-500/30 hover:shadow-purple-500/5 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/15 flex items-center justify-center shadow-lg shadow-purple-500/5 group-hover:shadow-purple-500/10 group-hover:border-purple-500/25 transition-all duration-500">
                    <Shield className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</p>
                    <p className="text-xl font-bold text-white mt-1.5">Private</p>
                    <p className="text-sm text-gray-500 mt-1">your group only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Categories */}
            {game.pricing_categories && game.pricing_categories.length > 0 && (
              <div className="group relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-10 border border-neutral-800/80 shadow-2xl shadow-black/40 hover:border-neutral-700/80 transition-all duration-500 overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/8 transition-colors duration-700" />

                <h2 className="relative text-2xl font-bold font-heading text-white mb-7 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 shadow-lg shadow-secondary/10">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </span>
                  Pricing
                </h2>

                <div className="relative space-y-3">
                  {game.pricing_categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="group/row flex items-center justify-between p-5 bg-gradient-to-r from-neutral-800/80 to-neutral-800/50 rounded-xl border border-neutral-700/40 hover:border-primary/30 hover:from-neutral-800 hover:to-neutral-800/70 transition-all duration-400 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div>
                        <p className="font-semibold text-white group-hover/row:text-white transition-colors">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                        )}
                        {(category.min_players || category.max_players) && (
                          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {category.min_players && category.max_players
                              ? `${category.min_players}-${category.max_players} players`
                              : category.min_players
                              ? `Min ${category.min_players} players`
                              : `Max ${category.max_players} players`}
                          </p>
                        )}
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${category.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {game.pricing_type && (
                  <div className="relative mt-5 flex items-center gap-2 text-sm text-gray-500 bg-neutral-800/40 rounded-lg px-4 py-2.5 border border-neutral-700/30">
                    <Info className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    Pricing is {pricingTypeLabel}
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {game.company_group && (
              <div className="group relative bg-gradient-to-br from-neutral-900 to-neutral-900/80 rounded-2xl p-6 border border-neutral-800/60 shadow-xl shadow-black/30 hover:border-primary/30 hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:shadow-primary/10 group-hover:border-primary/25 transition-all duration-500">
                    <MapPin className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                    <p className="text-lg font-bold text-white mt-0.5">{game.company_group.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl overflow-hidden border border-neutral-800/60 shadow-2xl shadow-black/50">
                {/* Subtle top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent" />

                {/* Booking Card Header */}
                <div className="relative bg-gradient-to-br from-primary via-primary to-primary-dark p-7 text-white overflow-hidden">
                  {/* Decorative pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-6 -right-6 w-32 h-32 border border-white/30 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-white/20 rounded-full" />
                  </div>

                  <h3 className="relative text-xl font-bold font-heading">Book This Room</h3>
                  {priceDisplay && (
                    <div className="relative mt-3 flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">{priceDisplay}</span>
                      {pricingTypeLabel && (
                        <span className="text-white/70 text-sm font-medium">{pricingTypeLabel}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Card Body */}
                <div className="p-7 space-y-6">
                  {/* Quick Info */}
                  <div className="space-y-0">
                    {[
                      { icon: Users, label: playerCount },
                      { icon: Clock, label: duration },
                      { icon: Lock, label: `${difficultyLabel} difficulty` },
                      { icon: Shield, label: "Private experience" },
                    ].map(({ icon: Icon, label }, i) => (
                      <div
                        key={label}
                        className="flex items-center gap-3.5 text-gray-300 py-3 border-b border-neutral-800/60 last:border-b-0 group/item hover:text-white transition-colors duration-300"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800/60 group-hover/item:bg-neutral-700/60 transition-colors duration-300">
                          <Icon className="w-4 h-4 text-gray-400 group-hover/item:text-gray-300 transition-colors duration-300" />
                        </span>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Deposit Info */}
                  {game.deposit_required === 1 && game.deposit_amount && (
                    <div className="bg-gradient-to-r from-amber-950/50 to-amber-950/30 rounded-xl p-4 border border-amber-800/30">
                      <p className="text-sm text-amber-300 flex items-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
                        <span>
                          <span className="font-semibold">Deposit required:</span>{" "}
                          ${game.deposit_amount.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <BookNowButton gameName={game.name} gameSlug={generateSlug(game.name)} />

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Free cancellation up to 24 hours in advance
                  </p>
                </div>
              </div>

              {/* Back link */}
              <div className="mt-6 text-center">
                <Link
                  href="/rooms"
                  className="group inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
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
