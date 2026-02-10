'use client';

/**
 * @deprecated Step 3 of the old 3-step booking flow. Superseded by OTC iframe embed.
 * See: components/booking/OTCBookingEmbed.tsx
 * Safe to remove once iframe integration is confirmed stable in production.
 */

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  User,
  Edit2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useBooking } from '@/lib/booking-context';
import { createBooking } from '@/lib/booking-api';
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

/** Format date string YYYY-MM-DD to readable display */
function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
}

function SummaryRow({ icon, label, value, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-neutral-800/50 rounded-xl">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-white font-medium text-sm truncate">{value}</div>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-gray-500 hover:text-primary transition-colors p-2 hover:bg-neutral-800 rounded-lg flex-shrink-0"
          aria-label={`Edit ${label}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function ReviewStep() {
  const {
    gameId,
    gameName,
    selectedDate,
    selectedSlot,
    groupSize,
    customerInfo,
    isLoading,
    goToStep,
    setIsLoading,
    setIsSuccess,
    previousStep,
  } = useBooking();

  const [error, setError] = useState<string | null>(null);

  const perPersonPrice = selectedSlot?.price ?? null;
  const total = perPersonPrice !== null ? perPersonPrice * groupSize : null;

  const handleConfirmBooking = async () => {
    if (!gameId || !selectedDate || !selectedSlot) {
      setError('Missing required booking information');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await createBooking({
        game_id: gameId,
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        group_size: groupSize,
        customer_email: customerInfo.email,
        customer_first_name: customerInfo.firstName,
        customer_last_name: customerInfo.lastName,
        customer_phone: customerInfo.phone || undefined,
        booking_slot_id: selectedSlot.booking_slot_id,
      });

      // Use the dedicated confirmation_number field (always present on success),
      // with fallbacks for backward compatibility
      const confirmationNumber =
        response.confirmation_number ??
        response.transaction?.order_number ??
        response.booking?.order_number ??
        response.booking?.id?.toString() ??
        null;

      if (response.note) {
        console.info('Booking note:', response.note);
      }
      if (response.warning) {
        console.warn('Booking warning:', response.warning);
      }

      setIsSuccess(true, confirmationNumber || 'CONFIRMED');
    } catch (err) {
      console.error('Booking failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create booking. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Booking Details Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-white">Review Your Booking</h2>
        </div>

        {/* Room name banner */}
        <div className="bg-primary/10 rounded-xl p-4 mb-5">
          <h3 className="text-base font-bold text-white">{gameName}</h3>
        </div>

        {/* Details rows */}
        <div className="space-y-3">
          <SummaryRow
            icon={<Calendar className="w-5 h-5" />}
            label="Date"
            value={selectedDate ? formatDate(selectedDate) : 'Not selected'}
            onEdit={() => goToStep(1)}
          />

          <SummaryRow
            icon={<Clock className="w-5 h-5" />}
            label="Time"
            value={
              selectedSlot
                ? `${formatTime(selectedSlot.start_time)} - ${formatTime(selectedSlot.end_time)}`
                : 'Not selected'
            }
            onEdit={() => goToStep(1)}
          />

          <SummaryRow
            icon={<Users className="w-5 h-5" />}
            label="Group Size"
            value={`${groupSize} ${groupSize === 1 ? 'player' : 'players'}`}
            onEdit={() => goToStep(2)}
          />

          <SummaryRow
            icon={<User className="w-5 h-5" />}
            label="Name"
            value={`${customerInfo.firstName} ${customerInfo.lastName}`}
            onEdit={() => goToStep(2)}
          />

          <SummaryRow
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={customerInfo.email}
            onEdit={() => goToStep(2)}
          />

          {customerInfo.phone && (
            <SummaryRow
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              value={customerInfo.phone}
              onEdit={() => goToStep(2)}
            />
          )}
        </div>

        {/* Price total */}
        {total !== null && (
          <div className="mt-5 p-4 bg-neutral-800 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-white">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              ${perPersonPrice?.toFixed(2)} x {groupSize} {groupSize === 1 ? 'player' : 'players'}
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-5">
        <p className="text-sm text-gray-400 leading-relaxed">
          By confirming this booking, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">
            terms and conditions
          </a>
          . A confirmation email will be sent to{' '}
          <span className="text-white font-medium">{customerInfo.email}</span>.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-950/40 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium text-sm">Booking Failed</p>
            <p className="text-red-400/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden lg:flex justify-between gap-4">
        <button
          type="button"
          onClick={previousStep}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0"
        >
          <ArrowLeft className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Back</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmBooking}
          disabled={isLoading}
          className="flex-1 max-w-md bg-primary hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
              <span className="relative z-10">Confirming...</span>
            </>
          ) : (
            <span className="relative z-10">Confirm Booking</span>
          )}
        </button>
      </div>

      {/* Mobile sticky bar */}
      <MobileBookingBar
        onContinue={handleConfirmBooking}
        continueLabel="Confirm Booking"
        disabled={isLoading}
        loading={isLoading}
      />
    </div>
  );
}
