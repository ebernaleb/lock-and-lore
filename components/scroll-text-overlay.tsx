'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollTextOverlayProps {
  progress: number;
  blackFrameStart: number;
}

interface WordConfig {
  text: string;
  startProgress: number;
  endProgress: number;
}

/**
 * Text overlay component for "CAN... YOU... ESCAPE..."
 * Mysterious, aesthetic reveal during black frames
 */
export default function ScrollTextOverlay({ progress, blackFrameStart }: ScrollTextOverlayProps) {
  const blackFrameProgress = Math.max(0, Math.min(1, (progress - blackFrameStart) / (1 - blackFrameStart)));

  if (progress < blackFrameStart) {
    return null;
  }

  const words: WordConfig[] = [
    { text: 'CAN', startProgress: 0, endProgress: 0.33 },
    { text: 'YOU', startProgress: 0.33, endProgress: 0.66 },
    { text: 'ESCAPE?', startProgress: 0.66, endProgress: 1.0 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      {words.map((word) => (
        <Word
          key={word.text}
          text={word.text}
          progress={blackFrameProgress}
          startProgress={word.startProgress}
          endProgress={word.endProgress}
        />
      ))}

    </div>
  );
}

interface WordProps {
  text: string;
  progress: number;
  startProgress: number;
  endProgress: number;
}

function Word({ text, progress, startProgress, endProgress }: WordProps) {
  const wordDuration = endProgress - startProgress;
  const fadeInEnd = startProgress + wordDuration * 0.25;
  const fadeOutStart = endProgress - wordDuration * 0.25;

  // Smooth opacity curve
  let opacity = 0;
  if (progress >= startProgress && progress <= endProgress) {
    if (progress < fadeInEnd) {
      // Gentle fade in
      const t = (progress - startProgress) / (fadeInEnd - startProgress);
      opacity = t * t; // Ease in
    } else if (progress > fadeOutStart) {
      // Gentle fade out
      const t = 1 - (progress - fadeOutStart) / (endProgress - fadeOutStart);
      opacity = t * t; // Ease out
    } else {
      opacity = 1;
    }
  }

  // Subtle scale: 0.95 -> 1.0 -> 1.05 (barely noticeable, elegant)
  let scale = 0.95;
  if (progress >= startProgress && progress <= endProgress) {
    const wordProgress = (progress - startProgress) / wordDuration;
    scale = 0.95 + wordProgress * 0.1;
  }

  // Subtle vertical drift
  const y = progress >= startProgress && progress <= endProgress
    ? 10 - ((progress - startProgress) / wordDuration) * 20
    : 10;

  // Letter spacing breathes slightly
  const letterSpacing = progress >= startProgress && progress <= endProgress
    ? 0.3 + ((progress - startProgress) / wordDuration) * 0.15
    : 0.3;

  if (opacity < 0.01) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <h1
        className="text-white font-black select-none tracking-tight uppercase px-4"
        style={{
          fontSize: 'clamp(3rem, 18vw, 15rem)',
          lineHeight: '0.85',
          fontFamily: 'var(--font-cinzel)',
          color: '#7f1d1d', // Darker red color
        }}
      >
        {text}
      </h1>
    </motion.div>
  );
}
