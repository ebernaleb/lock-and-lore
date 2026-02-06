'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface BookingLayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export default function BookingLayout({
  children,
  backHref,
  backLabel = 'Back to room',
}: BookingLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <main className="w-full py-4 md:py-8 flex-1">
        {/* Top bar with back link and centered logo */}
        <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8">
          <div className="relative flex items-center justify-center">
            {/* Back link -- positioned left (only show if backHref is provided) */}
            {backHref && (
              <Link
                href={backHref}
                className="absolute left-0 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            )}

            {/* Centered logo */}
            <Link
              href="/"
              className="relative block"
            >
              <Image
                src="/images/mainlogo.png"
                alt="Lock & Lore"
                width={320}
                height={107}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </Link>
          </div>
        </div>

        {children}
      </main>

      {/* Minimal footer */}
      <footer className="mt-auto border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex gap-6">
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
        </div>
      </footer>
    </div>
  );
}
