'use client';

import { useState, useEffect } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { fetchAvailability, type TimeSlot } from '@/lib/booking-api';

interface TimeSlotGridProps {
  gameId: number;
  selectedDate: string;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export default function TimeSlotGrid({
  gameId,
  selectedDate,
  selectedSlot,
  onSelectSlot,
}: TimeSlotGridProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate || !gameId) {
      setSlots([]);
      return;
    }

    const loadAvailability = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAvailability(gameId, selectedDate);
        setSlots(data.timeslots || []);
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load time slots';

        // Provide more helpful error messages
        if (errorMessage.includes('502') || errorMessage.includes('Bad Gateway')) {
          setError('Unable to fetch availability from booking system. This may be a temporary issue with the game provider. Please try a different date or contact support.');
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          setError('This game is not currently available for booking. Please try a different room.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
          setError('Request timed out. Please check your internet connection and try again.');
        } else {
          setError(errorMessage);
        }
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();
  }, [gameId, selectedDate]);

  const formatTime = (time: string) => {
    try {
      // Handle both "HH:MM:SS" and "HH:MM" formats
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch {
      return time;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm">Loading available times...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg space-y-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            fetchAvailability(gameId!, selectedDate!)
              .then((data) => {
                setSlots(data.timeslots || []);
              })
              .catch((err) => {
                console.error('Retry failed:', err);
                setError(err instanceof Error ? err.message : 'Failed to load time slots');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
          className="bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-4 py-2 text-sm rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none"
        >
          <span className="relative z-10">Try Again</span>
        </button>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Please select a date to view available time slots</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No time slots available for this date</p>
        <p className="text-sm mt-2">Please select a different date</p>
      </div>
    );
  }

  const availableSlots = slots.filter((slot) => slot.available);
  const unavailableSlots = slots.filter((slot) => !slot.available);

  return (
    <div className="space-y-4">
      {availableSlots.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">
            Available Time Slots ({availableSlots.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSlots.map((slot, index) => {
              const isSelected =
                selectedSlot?.start_time === slot.start_time &&
                selectedSlot?.end_time === slot.end_time;

              return (
                <button
                  key={index}
                  onClick={() => onSelectSlot(slot)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    flex flex-col items-start gap-2
                    ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-white'
                        : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600 text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatTime(slot.start_time)}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>

                  {slot.price !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <DollarSign className="w-3 h-3" />
                      <span>{slot.price.toFixed(2)}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {unavailableSlots.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">
            Unavailable ({unavailableSlots.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unavailableSlots.map((slot, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-neutral-800 bg-neutral-900/50 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span className="font-semibold text-neutral-600">
                    {formatTime(slot.start_time)}
                  </span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">Booked</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
