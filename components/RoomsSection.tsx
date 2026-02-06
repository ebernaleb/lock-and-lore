"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import type { OTCGame, OTCGamesResponse, OTCErrorResponse } from "@/types/otc-api";
import {
  generateSlug,
  getDifficultyLabel,
  getDifficultyColor,
  getGameImage,
  formatPlayerCount,
} from "@/lib/game-utils";

// ---------------------------------------------------------------------------
// Carousel Room Data Shape
// ---------------------------------------------------------------------------

interface CarouselRoom {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  players: string;
  duration: number;
  difficulty: string;
  difficultyColor: string;
  depositRequired?: boolean;
  depositAmount?: number;
}

// ---------------------------------------------------------------------------
// Fallback Data
// ---------------------------------------------------------------------------

const FALLBACK_ROOMS: CarouselRoom[] = [
  {
    id: -1,
    slug: "skybound-dynasty",
    title: "Skybound Dynasty",
    image: "/images/floatingcity_room.png",
    description:
      "High above the world, a city floats amongst the clouds. Valkeria. A kingdom of marble towers and starlight. Seven constellations shine above it, steady and bright. A coronation approaches, and you have been invited to witness history.",
    players: "2-10 Players",
    duration: 60,
    difficulty: "Moderate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: -2,
    slug: "escape-the-simulation",
    title: "Escape the Simulation",
    image: "/images/simulation_room.png",
    description:
      "You sit at your desk. Same screen. Same office. Another typical Tuesday. Everything feels real, until it doesn't. This office isn't a workplace, it's a simulation, and you've become self-aware.",
    players: "2-6 Players",
    duration: 60,
    difficulty: "Moderate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: -3,
    slug: "echo-chamber",
    title: "Echo Chamber",
    image: "/images/art_room.png",
    description:
      "As you explore the studio Mara left behind, you uncover two versions of her story, and the truth hidden behind the illusions she created. Only by separating reality from the lies she told herself can you discover what really happened.",
    players: "2-8 Players",
    duration: 60,
    difficulty: "Moderate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
];

// ---------------------------------------------------------------------------
// Helper: Map OTC Game to Carousel Room
// ---------------------------------------------------------------------------

function mapGameToRoom(game: OTCGame): CarouselRoom {
  return {
    id: game.id,
    slug: generateSlug(game.name),
    title: game.name,
    image: getGameImage(game),
    description: game.description || "An exciting escape room experience awaits!",
    players: formatPlayerCount(game),
    duration: game.duration ?? game.duration_minutes ?? 60,
    difficulty: getDifficultyLabel(game.difficulty),
    difficultyColor: getDifficultyColor(game.difficulty),
    depositRequired: game.deposit_required === 1,
    depositAmount: game.deposit_amount,
  };
}

// ---------------------------------------------------------------------------
// Slide widths and gap -- kept in sync with Tailwind classes below.
// These are the numeric equivalents used for translateX calculations.
// ---------------------------------------------------------------------------

const SLIDE_CONFIG = {
  // Card widths at each breakpoint (must match Tailwind classes on slides)
  widths: { base: 0, md: 650, lg: 850, xl: 1050, "2xl": 1250 },
  // Gap between cards (must match gap-4 / gap-6 below)
  gaps: { base: 16, md: 24 },
} as const;

// ---------------------------------------------------------------------------
// Carousel Slide Component
// ---------------------------------------------------------------------------

interface CarouselSlideProps {
  room: CarouselRoom;
  isActive: boolean;
  isPreview: boolean;
  onClick?: () => void;
}

function CarouselSlide({ room, isActive, isPreview, onClick }: CarouselSlideProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl md:rounded-3xl flex-shrink-0
        transition-all duration-700 ease-out
        w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)]
        md:w-[650px] lg:w-[850px] xl:w-[1050px] 2xl:w-[1250px]
        h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]
        ${isActive ? "scale-100 z-10 opacity-100" : ""}
        ${isPreview ? "scale-[0.85] origin-left cursor-pointer opacity-60" : ""}
        ${!isActive && !isPreview ? "scale-[0.85] origin-right opacity-60" : ""}
      `}
      onClick={!isActive ? onClick : undefined}
      role={!isActive ? "button" : undefined}
      tabIndex={!isActive ? 0 : undefined}
      aria-label={!isActive ? `Go to ${room.title}` : undefined}
      onKeyDown={
        !isActive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out blur-[2px]"
        style={{ backgroundImage: `url('${encodeURI(room.image)}')` }}
        role="img"
        aria-label={room.title}
      />

      {/* Dark gradient overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 ${!isActive ? 'opacity-70' : 'opacity-100'}`} />

      {/* Content overlay -- fades in/out based on active state */}
      <div className={`absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Room title */}
        <h3 className="font-heading font-extrabold text-white leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
          {room.title}
        </h3>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg line-clamp-2 mb-5 md:mb-7 max-w-2xl">
          {room.description}
        </p>
        <div>
          <Link
            href={`/rooms/${room.slug}`}
            scroll={true}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="relative z-10">Learn More</span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dot Indicators
// ---------------------------------------------------------------------------

interface DotIndicatorsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

function DotIndicators({ total, current, onChange }: DotIndicatorsProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 mt-8" role="tablist" aria-label="Carousel navigation">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1}`}
          className={`
            rounded-full transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black
            ${i === current
              ? "w-8 h-2.5 bg-primary"
              : "w-2.5 h-2.5 bg-neutral-600 hover:bg-neutral-500"}
          `}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation Arrow Button
// ---------------------------------------------------------------------------

interface NavArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}

function NavArrow({ direction, onClick, disabled }: NavArrowProps) {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "next" ? "Next room" : "Previous room"}
      className={`
        flex items-center justify-center
        w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18
        rounded-full
        bg-white/95 backdrop-blur-sm
        border-2 border-white
        text-black
        shadow-xl shadow-black/50
        transition-all duration-200
        hover:bg-primary hover:border-primary hover:text-neutral-950 hover:scale-110
        active:scale-95
        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/95 disabled:hover:border-white disabled:hover:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black
      `}
    >
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 stroke-[2.5]" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Hook: compute the translateX offset to center the active slide.
// Runs on mount + resize so it always uses the current viewport width.
// ---------------------------------------------------------------------------

function useTrackOffset(activeIndex: number, roomCount: number) {
  const [offset, setOffset] = useState(0);

  const calculate = useCallback(() => {
    if (roomCount === 0) return;

    const vw = window.innerWidth;

    // Determine which breakpoint applies (Tailwind default breakpoints)
    let cardWidth: number;
    let gap: number;

    if (vw >= 1536) {
      cardWidth = SLIDE_CONFIG.widths["2xl"];
      gap = SLIDE_CONFIG.gaps.md;
    } else if (vw >= 1280) {
      cardWidth = SLIDE_CONFIG.widths.xl;
      gap = SLIDE_CONFIG.gaps.md;
    } else if (vw >= 1024) {
      cardWidth = SLIDE_CONFIG.widths.lg;
      gap = SLIDE_CONFIG.gaps.md;
    } else if (vw >= 768) {
      cardWidth = SLIDE_CONFIG.widths.md;
      gap = SLIDE_CONFIG.gaps.md;
    } else {
      // Below md: cards are ~100vw - 2rem (32px) or 3rem (48px) at sm
      cardWidth = vw >= 640 ? vw - 48 : vw - 32;
      gap = SLIDE_CONFIG.gaps.base;
    }

    // Center the active card: offset = (viewport - cardWidth) / 2
    // Then shift left by activeIndex * (cardWidth + gap)
    const centeringOffset = (vw - cardWidth) / 2;
    const slideShift = activeIndex * (cardWidth + gap);

    setOffset(centeringOffset - slideShift);
  }, [activeIndex, roomCount]);

  useEffect(() => {
    calculate();

    const handleResize = () => calculate();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculate]);

  return offset;
}

// ---------------------------------------------------------------------------
// Main Rooms Section Component
// ---------------------------------------------------------------------------

export function RoomsSection() {
  const [rooms, setRooms] = useState<CarouselRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Touch/drag support
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play timer
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute the translateX value for the carousel track
  const trackOffset = useTrackOffset(activeIndex, rooms.length);

  // --- Data Fetching (preserved from original) ---
  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/games");

        if (!response.ok) {
          let errorMessage = "Failed to fetch games";
          try {
            const errorData: OTCErrorResponse = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Response body was not JSON; use the default message
          }
          throw new Error(errorMessage);
        }

        const data: OTCGamesResponse = await response.json();

        if (cancelled) return;

        // Filter to only show public games
        const publicGames = data.games.filter((game) => game.is_public === 1);

        if (publicGames.length === 0) {
          setRooms(FALLBACK_ROOMS);
          setUsingFallback(true);
          return;
        }

        setRooms(publicGames.map(mapGameToRoom));
        setUsingFallback(false);
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error ? err.message : "Failed to load games";
        setError(message);
        setRooms(FALLBACK_ROOMS);
        setUsingFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadGames();

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Navigation Helpers ---
  const roomCount = rooms.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || roomCount === 0) return;
      setIsTransitioning(true);
      setActiveIndex(((index % roomCount) + roomCount) % roomCount);
      // Match the CSS transition duration (700ms) to prevent rapid-fire clicks
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, roomCount]
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // --- Auto-play ---
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 6000);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (roomCount > 1) {
      resetAutoplay();
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [roomCount, activeIndex, resetAutoplay]);

  // --- Keyboard Navigation ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        resetAutoplay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        resetAutoplay();
      }
    },
    [goNext, goPrev, resetAutoplay]
  );

  // --- Touch / Drag Support ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goNext();
      resetAutoplay();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
      resetAutoplay();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }, [goNext, goPrev, resetAutoplay]);

  // --- Mouse Drag Support ---
  const mouseStartX = useRef<number | null>(null);
  const mouseDeltaX = useRef<number>(0);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    mouseDeltaX.current = 0;
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    mouseDeltaX.current = e.clientX - mouseStartX.current;
    if (Math.abs(mouseDeltaX.current) > 5) {
      isDragging.current = true;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    const threshold = 50;
    if (isDragging.current) {
      if (mouseDeltaX.current < -threshold) {
        goNext();
        resetAutoplay();
      } else if (mouseDeltaX.current > threshold) {
        goPrev();
        resetAutoplay();
      }
    }
    mouseStartX.current = null;
    mouseDeltaX.current = 0;
    isDragging.current = false;
  }, [goNext, goPrev, resetAutoplay]);

  const handleMouseLeave = useCallback(() => {
    mouseStartX.current = null;
    mouseDeltaX.current = 0;
    isDragging.current = false;
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-black relative overflow-hidden" id="rooms">
      {/* Section Header - Constrained width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          {/* Main heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 font-heading leading-[1.1] tracking-tight">
            Pick Your{" "}
            <span className="text-primary">Game</span>
          </h2>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
            Step into immersive worlds, solve intricate puzzles, and race the clock.
            Every room is a private experience for your group.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-700 border-t-primary" />
              <p className="text-neutral-500 text-sm">Loading games...</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto bg-orange-950/50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-300 font-semibold mb-1">
                  Unable to load live game data
                </p>
                <p className="text-orange-400 text-sm">{error}</p>
                <p className="text-orange-400/80 text-sm mt-2">
                  Showing default rooms below. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Carousel - Full width, no constraints */}
      {!loading && rooms.length > 0 && (
          <div
            role="region"
            aria-label="Featured escape rooms carousel"
            aria-roledescription="carousel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-3xl"
          >
            {/* Carousel Track Container with controlled overflow */}
            <div className="relative overflow-hidden">
              {/* Carousel Track - All slides rendered; translateX drives the animation */}
              <div
                ref={carouselRef}
                className="flex items-center gap-4 md:gap-6 select-none cursor-grab active:cursor-grabbing transition-transform duration-700 ease-in-out will-change-transform"
                style={{ transform: `translateX(${trackOffset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {rooms.map((room, index) => {
                  const isActive = index === activeIndex;
                  const isPreview = roomCount > 1 && index === (activeIndex + 1) % roomCount;

                  return (
                    <CarouselSlide
                      key={room.id}
                      room={room}
                      isActive={isActive}
                      isPreview={isPreview}
                      onClick={() => {
                        goToSlide(index);
                        resetAutoplay();
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Navigation Arrows */}
            {roomCount > 1 && (
              <>
                {/* Previous Arrow - Left edge */}
                <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20">
                  <NavArrow
                    direction="prev"
                    onClick={() => {
                      goPrev();
                      resetAutoplay();
                    }}
                  />
                </div>

                {/* Next Arrow - Right edge */}
                <div className="absolute right-4 sm:right-6 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20">
                  <NavArrow
                    direction="next"
                    onClick={() => {
                      goNext();
                      resetAutoplay();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

      {/* Empty state -- only if loaded and genuinely no rooms */}
      {!loading && rooms.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">
              No games available at the moment. Check back soon!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
