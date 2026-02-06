'use client';

import { Calendar, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBooking } from '@/lib/booking-context';
import { fetchAvailability, type TimeSlot } from '@/lib/booking-api';
import { MobileBookingBar } from './RoomSummaryCard';

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

export default function ScheduleStep() {
  const {
    gameId,
    selectedDate,
    selectedSlot,
    setSelectedDate,
    setSelectedSlot,
    nextStep,
  } = useBooking();

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Calculate date range
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 90);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const canProceed = !!(selectedDate && selectedSlot);

  // Fetch time slots when date changes
  useEffect(() => {
    if (!selectedDate || !gameId) {
      setSlots([]);
      return;
    }

    const loadAvailability = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);

      try {
        const data = await fetchAvailability(gameId, selectedDate);
        setSlots(data.timeslots || []);
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load time slots';

        if (errorMessage.includes('502') || errorMessage.includes('Bad Gateway')) {
          setSlotsError('Unable to fetch availability. This may be a temporary issue. Please try a different date or try again later.');
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          setSlotsError('This game is not currently available for booking. Please try a different room.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
          setSlotsError('Request timed out. Please check your connection and try again.');
        } else {
          setSlotsError(errorMessage);
        }
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadAvailability();
  }, [gameId, selectedDate]);

  const retryFetch = () => {
    if (!gameId || !selectedDate) return;
    setSlotsError(null);
    setIsLoadingSlots(true);
    fetchAvailability(gameId, selectedDate)
      .then((data) => setSlots(data.timeslots || []))
      .catch((err) => {
        setSlotsError(err instanceof Error ? err.message : 'Failed to load time slots');
      })
      .finally(() => setIsLoadingSlots(false));
  };

  const handleContinue = () => {
    if (canProceed) nextStep();
  };

  const availableSlots = slots.filter((s) => s.available);
  const unavailableSlots = slots.filter((s) => !s.available);

  return (
    <div className="space-y-4">
      {/* Date Selection Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-white">Select Date</h2>
        </div>

        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            max={maxDate}
            required
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors [color-scheme:dark] text-base"
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Choose a date to see available time slots
        </p>
      </div>

      {/* Time Slots Card */}
      {selectedDate && (
        <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Available Times
              {!isLoadingSlots && !slotsError && availableSlots.length > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({availableSlots.length} available)
                </span>
              )}
            </h2>
          </div>

          {/* Loading state */}
          {isLoadingSlots && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading available times...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {slotsError && (
            <div className="p-4 bg-red-950/30 rounded-xl space-y-3">
              <p className="text-red-300 text-sm">{slotsError}</p>
              <button
                onClick={retryFetch}
                className="bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-4 py-2 text-sm rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none"
              >
                <span className="relative z-10">Try Again</span>
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingSlots && !slotsError && slots.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No time slots available for this date</p>
              <p className="text-sm mt-2 text-gray-500">Please select a different date</p>
            </div>
          )}

          {/* Available slots */}
          {!isLoadingSlots && !slotsError && availableSlots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot, index) => {
                const isSelected =
                  selectedSlot?.start_time === slot.start_time &&
                  selectedSlot?.end_time === slot.end_time;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 hover:bg-neutral-800'
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white text-sm">
                        {formatTime(slot.start_time)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </div>

                    {slot.price !== undefined && (
                      <div className="flex items-center gap-1 text-sm text-primary font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{slot.price.toFixed(2)}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Unavailable slots */}
          {!isLoadingSlots && !slotsError && unavailableSlots.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wider">
                Unavailable ({unavailableSlots.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {unavailableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-neutral-800 bg-neutral-900/30 opacity-40 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-600 text-sm">
                        {formatTime(slot.start_time)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 mt-1">Booked</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop continue button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canProceed}
        className={`hidden lg:flex w-full py-3 items-center justify-center text-base font-medium rounded-full transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:pointer-events-none disabled:hover:translate-y-0 disabled:active:translate-y-0 ${
          canProceed
            ? 'bg-primary hover:bg-primary-dark text-neutral-950 shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)]'
            : 'bg-neutral-800 text-gray-500 cursor-not-allowed shadow-[0_4px_0_0_rgba(39,39,42,1)]'
        }`}
      >
        <span className="relative z-10">Continue to Details</span>
      </button>

      {/* Mobile sticky bar */}
      <MobileBookingBar
        onContinue={handleContinue}
        continueLabel="Continue to Details"
        disabled={!canProceed}
      />
    </div>
  );
}
