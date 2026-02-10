'use client';

/**
 * @deprecated Step 2 of the old 3-step booking flow. Superseded by OTC iframe embed.
 * See: components/booking/OTCBookingEmbed.tsx
 * Safe to remove once iframe integration is confirmed stable in production.
 */

import { useState } from 'react';
import { Users, Mail, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useBooking } from '@/lib/booking-context';
import { validateCustomerForm } from '@/lib/validation';
import { MobileBookingBar } from './RoomSummaryCard';

export default function DetailsStep() {
  const {
    customerInfo,
    groupSize,
    errors,
    gameMinPlayers,
    gameMaxPlayers,
    setCustomerInfo,
    setGroupSize,
    setErrors,
    nextStep,
    previousStep,
  } = useBooking();

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    });

    const validationErrors = validateCustomerForm(customerInfo);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    nextStep();
  };

  const canDecrement = groupSize > gameMinPlayers;
  const canIncrement = groupSize < gameMaxPlayers;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Group Size Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Group Size</h2>
        </div>

        <div className="flex items-center gap-4 p-4 bg-neutral-800 rounded-xl">
          <Users className="w-5 h-5 text-gray-400" />

          <div className="flex items-center gap-4 flex-1">
            <button
              type="button"
              onClick={() => canDecrement && setGroupSize(groupSize - 1)}
              disabled={!canDecrement}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canDecrement
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-neutral-800 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Decrease group size"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white">{groupSize}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {groupSize === 1 ? 'player' : 'players'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => canIncrement && setGroupSize(groupSize + 1)}
              disabled={!canIncrement}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canIncrement
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-neutral-800 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Increase group size"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          This room accommodates {gameMinPlayers}-{gameMaxPlayers} players
        </p>
      </div>

      {/* Contact Information Card */}
      <div className="bg-neutral-900 rounded-2xl shadow-xl shadow-black/30 p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Mail className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Contact Information</h2>
        </div>

        <div className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">First Name *</label>
              <input
                type="text"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({ firstName: e.target.value })}
                onBlur={() => handleBlur('firstName')}
                placeholder="John"
                required
                className={`flex h-11 w-full rounded-lg border bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  touched.firstName && errors.firstName
                    ? 'border-red-500'
                    : 'border-neutral-700 focus:border-primary'
                }`}
              />
              {touched.firstName && errors.firstName && (
                <p className="text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Last Name *</label>
              <input
                type="text"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({ lastName: e.target.value })}
                onBlur={() => handleBlur('lastName')}
                placeholder="Doe"
                required
                className={`flex h-11 w-full rounded-lg border bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  touched.lastName && errors.lastName
                    ? 'border-red-500'
                    : 'border-neutral-700 focus:border-primary'
                }`}
              />
              {touched.lastName && errors.lastName && (
                <p className="text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Email Address *</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ email: e.target.value })}
              onBlur={() => handleBlur('email')}
              placeholder="john.doe@example.com"
              required
              className={`flex h-11 w-full rounded-lg border bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                touched.email && errors.email
                  ? 'border-red-500'
                  : 'border-neutral-700 focus:border-primary'
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Phone Number <span className="text-gray-600">(optional)</span></label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ phone: e.target.value })}
              onBlur={() => handleBlur('phone')}
              placeholder="(555) 123-4567"
              className={`flex h-11 w-full rounded-lg border bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                touched.phone && errors.phone
                  ? 'border-red-500'
                  : 'border-neutral-700 focus:border-primary'
              }`}
            />
            {touched.phone && errors.phone && (
              <p className="text-xs text-red-400">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex justify-between gap-4">
        <button
          type="button"
          onClick={previousStep}
          className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-6 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(39,39,42,1)] hover:shadow-[0_2px_0_0_rgba(39,39,42,1)] active:shadow-[0_0px_0_0_rgba(39,39,42,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] before:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Back</span>
        </button>

        <button
          type="submit"
          className="flex-1 max-w-md bg-primary hover:bg-primary-dark text-neutral-950 font-medium py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none"
        >
          <span className="relative z-10">Continue to Review</span>
        </button>
      </div>

      {/* Mobile sticky bar */}
      <MobileBookingBar
        onContinue={() => {
          // Trigger form submit via ref workaround: programmatically dispatch submit
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        }}
        continueLabel="Continue to Review"
      />
    </form>
  );
}
