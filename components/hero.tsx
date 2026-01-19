'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ScrollSequenceCanvas from '@/components/ScrollSequenceCanvas';
import ScrollTextOverlay from '@/components/scroll-text-overlay';
import HeroOverlay from '@/components/hero-overlay';

export default function Hero() {
  return (
    <section className="relative" style={{ position: 'relative' }}>
      {/* Scroll-Driven Frame Animation Section */}
      <ScrollSequenceCanvas
        basePath="/sequence/"
        frameCount={265}
        priorityFrames={10}
        scrollHeight={350}
        fitMode="cover"
        slowdown={{ startAt: 192 / 265, factor: 0.3 }}
        renderLoader={(progress) => (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
            <div className="text-center">
              {/* Animated Progress Bar */}
              <div className="mb-6">
                <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Loading Text */}
              <motion.p
                className="text-white/70 text-sm font-medium tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading Experience
              </motion.p>

              {/* Frame Counter */}
              <motion.p
                className="text-white/40 text-xs mt-3 tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {progress.loaded} / {progress.total} frames
              </motion.p>

              {/* Percentage */}
              <motion.p
                className="text-white/60 text-2xl font-bold mt-4 tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {progress.percentage}%
              </motion.p>
            </div>
          </div>
        )}
        renderOverlay={(progress) => (
          <>
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <HeroOverlay progress={progress} />
            <ScrollTextOverlay progress={progress} blackFrameStart={192 / 265} />
          </>
        )}
      />

      {/* Black fade transition to next section */}
      <div className="h-48 bg-gradient-to-b from-black via-black to-background" />
    </section>
  );
}
