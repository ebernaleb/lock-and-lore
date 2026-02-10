'use client';

/**
 * @deprecated Success screen from the old 3-step booking flow.
 * The OTC iframe handles confirmation display internally.
 * Safe to remove once iframe integration is confirmed stable in production.
 */

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, Copy, Check, ArrowLeft } from 'lucide-react';
import { useBooking } from '@/lib/booking-context';

export default function BookingSuccessView() {
  const { confirmationNumber, customerInfo } = useBooking();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = async () => {
    if (!confirmationNumber) return;
    try {
      await navigator.clipboard.writeText(confirmationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12 px-4">
      {/* Header */}
      <div className="text-center space-y-6 pt-4">
        <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">
            Your escape room adventure is all set
          </p>
        </div>

        {/* Email confirmation - positioned right below heading */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Mail className="w-4 h-4" />
          <span>
            Confirmation sent to{' '}
            <span className="text-white font-medium">{customerInfo.email}</span>
          </span>
        </div>

        {/* Confirmation number - primary focal element */}
        {confirmationNumber && (
          <div className="bg-neutral-900/60 rounded-2xl px-8 py-6 mx-auto max-w-sm">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2">
              Confirmation Number
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary font-mono tracking-wide">
              {confirmationNumber}
            </div>
            <button
              onClick={handleCopyOrderNumber}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
              title="Copy confirmation number"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="flex justify-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-neutral-950 font-medium px-8 py-3 text-base rounded-full shadow-[0_4px_0_0_rgba(122,92,32,1)] hover:shadow-[0_2px_0_0_rgba(122,92,32,1)] active:shadow-[0_0px_0_0_rgba(122,92,32,1)] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-150 relative before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.2)] before:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
