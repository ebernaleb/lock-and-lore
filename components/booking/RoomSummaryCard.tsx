'use client';

import { Users, Clock, Lock, Receipt, Calendar, Timer } from 'lucide-react';
import { useBooking } from '@/lib/booking-context';
import { getDifficultyLabel } from '@/lib/game-utils';

/** Format time from HH:MM(:SS) to 12-hour display */
function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } catch {
    return time;
  }
}

/** Format date string YYYY-MM-DD to readable display */
function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Right-column sidebar showing room info and dynamic pricing summary.
 * Sticky on desktop, hidden on mobile (replaced by MobileBookingBar).
 */
export default function RoomSummaryCard() {
  const {
    gameName,
    gameImage,
    gameDuration,
    gameMinPlayers,
    gameMaxPlayers,
    gameDifficulty,
    gamePricingType,
    selectedDate,
    selectedSlot,
    groupSize,
  } = useBooking();

  const perPersonPrice = selectedSlot?.price ?? null;
  const total = perPersonPrice !== null ? perPersonPrice * groupSize : null;

  return (
    <div className="hidden lg:block sticky top-8 space-y-4">
      {/* Room Info Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        {/* Room image */}
        {gameImage && (
          <div className="aspect-video w-full overflow-hidden bg-neutral-800">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${gameImage}')` }}
              role="img"
              aria-label={gameName}
            />
          </div>
        )}

        <div className="p-5">
          <h2 className="font-heading font-bold text-lg text-white mb-3">
            {gameName}
          </h2>

          {/* Quick info pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-gray-300 text-xs font-medium py-1.5 px-3 rounded-full">
              <Users className="w-3.5 h-3.5" />
              {gameMinPlayers}-{gameMaxPlayers}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-gray-300 text-xs font-medium py-1.5 px-3 rounded-full">
              <Timer className="w-3.5 h-3.5" />
              {gameDuration} min
            </span>
            <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-gray-300 text-xs font-medium py-1.5 px-3 rounded-full">
              <Lock className="w-3.5 h-3.5" />
              {getDifficultyLabel(gameDifficulty)}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Summary Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-semibold text-white">Booking Summary</h3>
        </div>

        <div className="space-y-3">
          {/* Date */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </span>
            <span className="text-white font-medium">
              {selectedDate ? formatDate(selectedDate) : <span className="text-gray-600 italic">Not selected</span>}
            </span>
          </div>

          {/* Time */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </span>
            <span className="text-white font-medium">
              {selectedSlot ? formatTime(selectedSlot.start_time) : <span className="text-gray-600 italic">Not selected</span>}
            </span>
          </div>

          {/* Group size */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group
            </span>
            <span className="text-white font-medium">
              {groupSize} {groupSize === 1 ? 'player' : 'players'}
            </span>
          </div>

          {/* Per person price */}
          {perPersonPrice !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Per person</span>
              <span className="text-white font-medium">
                ${perPersonPrice.toFixed(2)}
                {gamePricingType && (
                  <span className="text-gray-500 text-xs ml-1">/ person</span>
                )}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-neutral-800 my-1" />

          {/* Total */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-white">
              {total !== null ? (
                `$${total.toFixed(2)}`
              ) : (
                <span className="text-gray-600 text-base italic font-normal">--</span>
              )}
            </span>
          </div>

          {total !== null && (
            <p className="text-xs text-gray-500 text-right">
              ${perPersonPrice?.toFixed(2)} x {groupSize} {groupSize === 1 ? 'player' : 'players'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile sticky bottom bar showing price total and the current action button.
 * Only visible on screens < lg (1024px).
 */
export function MobileBookingBar({
  onContinue,
  continueLabel = 'Continue',
  disabled = false,
  loading = false,
}: {
  onContinue: () => void;
  continueLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { selectedSlot, groupSize } = useBooking();

  const perPersonPrice = selectedSlot?.price ?? null;
  const total = perPersonPrice !== null ? perPersonPrice * groupSize : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Top fade */}
      <div className="h-4 bg-gradient-to-t from-black to-transparent pointer-events-none" aria-hidden="true" />

      <div className="bg-black px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex-shrink-0">
            {total !== null ? (
              <div>
                <div className="text-lg font-bold text-white">${total.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {groupSize} {groupSize === 1 ? 'player' : 'players'}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">Select time to see price</div>
            )}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={onContinue}
            disabled={disabled || loading}
            className={`flex-1 max-w-[200px] py-3 text-base font-medium rounded-full transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:pointer-events-none ${
              disabled
                ? 'bg-neutral-800 text-gray-500 cursor-not-allowed shadow-[0_4px_0_0_rgba(39,39,42,1)]'
                : 'bg-primary hover:bg-primary-dark text-neutral-950 shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)]'
            } disabled:hover:translate-y-0 disabled:active:translate-y-0`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="relative z-10">{continueLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
