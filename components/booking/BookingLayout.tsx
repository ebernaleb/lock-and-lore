'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BookingLayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export default function BookingLayout({ children, backHref, backLabel }: BookingLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* Back link */}
      <Link
        href={backHref ?? "/rooms"}
        className="fixed top-6 left-6 z-50 text-white hover:text-primary transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        {backLabel || 'Back'}
      </Link>

      {children}
    </div>
  );
}
