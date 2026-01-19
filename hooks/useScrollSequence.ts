/**
 * Custom hook for scroll-driven frame sequence animations
 * Provides reusable logic for managing scroll-to-frame mapping
 */

import { useRef, useCallback, MutableRefObject } from 'react';
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

export interface UseScrollSequenceOptions {
  /** Total number of frames in the sequence */
  frameCount: number;
  /** Spring physics configuration */
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
    restDelta?: number;
  };
  /** Scroll offset configuration */
  scrollOffset?: ['start start' | 'end end', 'start start' | 'end end'];
}

export interface UseScrollSequenceReturn {
  /** Ref to attach to the scroll container */
  containerRef: MutableRefObject<HTMLDivElement | null>;
  /** Current frame index (0-based) */
  currentFrameIndex: MutableRefObject<number>;
  /** Raw scroll progress (0-1) */
  scrollProgress: MotionValue<number>;
  /** Smoothed scroll progress (0-1) */
  smoothProgress: MotionValue<number>;
  /** Frame index as motion value (0 to frameCount-1) */
  frameMotionValue: MotionValue<number>;
  /** Subscribe to frame changes */
  onFrameChange: (callback: (frameIndex: number) => void) => () => void;
}

/**
 * Hook for managing scroll-driven frame sequences
 *
 * @example
 * const { containerRef, onFrameChange } = useScrollSequence({
 *   frameCount: 192,
 *   springConfig: { stiffness: 120, damping: 30 }
 * });
 *
 * useEffect(() => {
 *   return onFrameChange((frameIndex) => {
 *     console.log('Current frame:', frameIndex);
 *   });
 * }, []);
 */
export function useScrollSequence({
  frameCount,
  springConfig = {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
    restDelta: 0.001,
  },
  scrollOffset = ['start start', 'end end'],
}: UseScrollSequenceOptions): UseScrollSequenceReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentFrameIndex = useRef<number>(0);

  // Track scroll progress in the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset,
  });

  // Apply spring physics for smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Transform progress to frame index
  const frameMotionValue = useTransform(
    smoothProgress,
    (progress) => {
      const index = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(progress * frameCount))
      );
      return index;
    }
  );

  /**
   * Subscribe to frame index changes
   * Returns unsubscribe function
   */
  const onFrameChange = useCallback(
    (callback: (frameIndex: number) => void) => {
      const unsubscribe = frameMotionValue.on('change', (latest) => {
        const frameIndex = Math.round(latest);
        if (frameIndex !== currentFrameIndex.current) {
          currentFrameIndex.current = frameIndex;
          callback(frameIndex);
        }
      });

      return unsubscribe;
    },
    [frameMotionValue]
  );

  return {
    containerRef,
    currentFrameIndex,
    scrollProgress: scrollYProgress,
    smoothProgress,
    frameMotionValue,
    onFrameChange,
  };
}
