'use client';

import React from 'react';
import ScrollSequenceCanvas from '@/components/ScrollSequenceCanvas';
import ScrollTextOverlay from '@/components/scroll-text-overlay';
import HeroOverlay from '@/components/hero-overlay';

export default function Hero() {
  return (
    <section className="relative" style={{ position: 'relative' }}>
      {/* Scroll-Driven Frame Animation Section */}
      <ScrollSequenceCanvas
        basePath="/sequence/"
        frameCount={255}
        priorityFrames={10}
        scrollHeight={312}
        fitMode="cover"
        slowdown={{ startAt: 185 / 255, factor: 0.3 }}
        autoPlayTriggerFrame={10}
        renderOverlay={(progress) => (
          <>
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <HeroOverlay progress={progress} />
            <ScrollTextOverlay progress={progress} blackFrameStart={185 / 255} />
          </>
        )}
      />

      {/* Black fade transition to next section */}
      <div className="h-48 bg-gradient-to-b from-black via-black to-background" />
    </section>
  );
}
