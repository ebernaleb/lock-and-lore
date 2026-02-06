'use client';

import { useEffect } from 'react';
import { useBooking } from '@/lib/booking-context';
import BookingLayout from './BookingLayout';
import BookingStepper from './BookingStepper';
import ScheduleStep from './ScheduleStep';
import DetailsStep from './DetailsStep';
import ReviewStep from './ReviewStep';
import BookingSuccessView from './BookingSuccessView';
import RoomSummaryCard from './RoomSummaryCard';
import type { OTCGame } from '@/types/otc-api';
import { getDifficultyLevel } from '@/lib/game-utils';

interface BookingPageProps {
  game: OTCGame;
  imageUrl: string;
  slug: string;
}

export default function BookingPage({ game, imageUrl, slug }: BookingPageProps) {
  const { currentStep, isSuccess, gameId, initializeBooking } = useBooking();

  // Initialize booking context with game data on mount
  useEffect(() => {
    // Only initialize if not already set for this game (prevents re-init on HMR)
    if (gameId !== game.id) {
      initializeBooking({
        gameId: game.id,
        gameName: game.name,
        gameSlug: slug,
        gameImage: imageUrl,
        gameDuration: game.duration ?? game.duration_minutes ?? 60,
        gameMinPlayers: game.min_players ?? game.min_players_count ?? 2,
        gameMaxPlayers: game.max_players ?? game.max_players_count ?? 8,
        gameDifficulty: getDifficultyLevel(game.difficulty),
        gamePricingType: game.pricing_type ?? '',
      });
    }
  }, [game, imageUrl, slug, gameId, initializeBooking]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, isSuccess]);

  // Render current step content
  const renderStepContent = () => {
    if (isSuccess) {
      return <BookingSuccessView />;
    }

    switch (currentStep) {
      case 1:
        return <ScheduleStep />;
      case 2:
        return <DetailsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <BookingLayout
      backHref={isSuccess ? undefined : `/rooms/${slug}`}
      backLabel="Back to room"
    >
      {/* Success state: full-width centered, no sidebar */}
      {isSuccess ? (
        <BookingSuccessView />
      ) : (
        <>
          {/* Stepper */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-10 px-4">
            <BookingStepper currentStep={currentStep} />
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
            {/* Left Column: Step Content */}
            <div className="flex-1 min-w-0 pb-24 lg:pb-0">
              {renderStepContent()}
            </div>

            {/* Right Column: Room Summary (desktop only; mobile uses sticky bar) */}
            <div className="w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0">
              <RoomSummaryCard />
            </div>
          </div>
        </>
      )}
    </BookingLayout>
  );
}
