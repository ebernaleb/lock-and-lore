'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { preloadImages, PreloadProgress } from '@/lib/preload-images';
import { setupCanvas, drawImageToCanvas, FitMode } from '@/lib/canvas-utils';

interface SlowdownConfig {
  /** Progress point where slowdown begins (0-1) */
  startAt: number;
  /** Slowdown factor (e.g., 0.5 = 50% slower) */
  factor: number;
}

interface ScrollSequenceCanvasProps {
  /** Base path for the image sequence (e.g., '/sequence/') */
  basePath?: string;
  /** Total number of frames in the sequence */
  frameCount?: number;
  /** Number of frames to preload immediately (default: 10) */
  priorityFrames?: number;
  /** Fit mode for images: 'contain' or 'cover' (default: 'cover') */
  fitMode?: FitMode;
  /** Height of the scroll container in viewport heights (default: 400) */
  scrollHeight?: number;
  /** Custom className for the wrapper */
  className?: string;
  /** Render overlay content based on scroll progress */
  renderOverlay?: (progress: number) => React.ReactNode;
  /** Callback when loading completes */
  onLoadComplete?: () => void;
  /** Optional slowdown configuration for specific sections */
  slowdown?: SlowdownConfig;
  /** Frame at which to trigger auto-play (default: 10) */
  autoPlayTriggerFrame?: number;
}

/**
 * Production-ready scroll-driven frame-by-frame canvas animation
 *
 * Features:
 * - Buttery smooth 60fps scrolling
 * - Frame-stable rendering (no flicker)
 * - Responsive scaling with devicePixelRatio support
 * - Intelligent preloading (priority frames + chunked batches)
 * - Proper cleanup and memory management
 * - TypeScript with full type safety
 *
 * @example
 * <ScrollSequenceCanvas
 *   basePath="/sequence/"
 *   frameCount={192}
 *   scrollHeight={400}
 *   fitMode="cover"
 * />
 */
export default function ScrollSequenceCanvas({
  basePath = '/sequence/',
  frameCount = 192,
  priorityFrames = 10,
  fitMode = 'cover',
  scrollHeight = 400,
  className = '',
  renderOverlay,
  onLoadComplete,
  slowdown,
  autoPlayTriggerFrame = 10,
}: ScrollSequenceCanvasProps) {
  /**
   * Apply non-linear progress mapping for slowdown effect
   * Before startAt: progress at normal speed
   * After startAt: progress slowed down by factor (0.5 = 50% slower, needs 2x scroll)
   */
  const applySlowdown = useCallback((rawProgress: number): number => {
    if (!slowdown) return rawProgress;

    const { startAt, factor } = slowdown;

    // Calculate scroll distribution
    // The slowdown section needs (1/factor) times more scroll to cover
    const originalSlowdownLength = 1 - startAt;
    const stretchedSlowdownLength = originalSlowdownLength / factor;
    const totalStretchedLength = startAt + stretchedSlowdownLength;

    // Normalize to determine scroll breakpoint
    const preSlowdownScrollPortion = startAt / totalStretchedLength;

    if (rawProgress <= preSlowdownScrollPortion) {
      // Map [0, preSlowdownScrollPortion] to [0, startAt]
      return (rawProgress / preSlowdownScrollPortion) * startAt;
    } else {
      // Map [preSlowdownScrollPortion, 1] to [startAt, 1]
      const slowdownScrollProgress = (rawProgress - preSlowdownScrollPortion) / (1 - preSlowdownScrollPortion);
      return startAt + slowdownScrollProgress * (1 - startAt);
    }
  }, [slowdown]);
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null); // Ref for the sticky viewport
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoPlayTriggeredRef = useRef<boolean>(false);
  const isAutoPlayingRef = useRef<boolean>(false);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: frameCount,
    percentage: 0,
  });
  const [canvasReady, setCanvasReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on page load/refresh to reset the animation
  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset auto-play state in case of hot reload
    autoPlayTriggeredRef.current = false;
    isAutoPlayingRef.current = false;
  }, []);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
    restDelta: 0.001,
  });

  /**
   * Auto-play the sequence to completion
   * Smoothly scrolls to the end of the container, which triggers frame updates
   * Black frames (CAN YOU ESCAPE section) play 30% slower for dramatic effect
   */
  const triggerAutoPlay = useCallback(() => {
    if (!containerRef.current || isAutoPlayingRef.current || autoPlayTriggeredRef.current) {
      return;
    }

    autoPlayTriggeredRef.current = true;
    isAutoPlayingRef.current = true;

    // Get the container's position and height
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const containerHeight = container.clientHeight;

    // Calculate the target scroll position (end of container)
    const targetScroll = containerTop + containerHeight - window.innerHeight;

    // Black frames start at 185/255 of the sequence
    const blackFrameStart = 185 / 255; // ~0.725

    // Calculate timing with faster normal frames and slower black frames
    // Normal section: 0 to blackFrameStart (72.5%) - plays 15% faster
    // Black section: blackFrameStart to 1.0 (27.5%) - plays 30% slower
    const baseDuration = 4000; // Base duration in ms
    const normalSectionRatio = blackFrameStart;
    const blackSectionRatio = 1 - blackFrameStart;

    // Time allocation: normal section at 0.85x duration (15% faster), black section at 2x duration
    const normalSectionTime = baseDuration * normalSectionRatio * 0.85; // 15% faster
    const blackSectionTime = baseDuration * blackSectionRatio * 2.0; // 100% slower (2x duration)
    const totalDuration = normalSectionTime + blackSectionTime;

    // Time breakpoint where black frames begin
    const timeBreakpoint = normalSectionTime / totalDuration;

    const startTime = performance.now();
    const startScroll = window.scrollY;
    const scrollDistance = targetScroll - startScroll;

    /**
     * Custom easing function for smooth acceleration and deceleration
     * Using ease-in-out-cubic for a polished, professional feel
     */
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    /**
     * Maps time progress to scroll progress with slower black frames
     * Before timeBreakpoint: normal speed through first 72.5% of scroll
     * After timeBreakpoint: slower speed through remaining 27.5% of scroll
     */
    const mapTimeToScroll = (timeProgress: number): number => {
      if (timeProgress <= timeBreakpoint) {
        // Map [0, timeBreakpoint] to [0, blackFrameStart]
        return (timeProgress / timeBreakpoint) * blackFrameStart;
      } else {
        // Map [timeBreakpoint, 1] to [blackFrameStart, 1]
        const blackProgress = (timeProgress - timeBreakpoint) / (1 - timeBreakpoint);
        return blackFrameStart + blackProgress * (1 - blackFrameStart);
      }
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const timeProgress = Math.min(elapsed / totalDuration, 1);
      const easedTimeProgress = easeInOutCubic(timeProgress);

      // Apply the time-to-scroll mapping for slower black frames
      const scrollProgress = mapTimeToScroll(easedTimeProgress);

      const currentScroll = startScroll + (scrollDistance * scrollProgress);
      window.scrollTo(0, currentScroll);

      if (timeProgress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isAutoPlayingRef.current = false;
        // Scroll directly to the rooms section with offset
        setTimeout(() => {
          const roomsSection = document.getElementById('rooms');
          if (roomsSection) {
            const offset = 150; // Offset to show rooms cards better
            const elementPosition = roomsSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementPosition + offset,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  /**
   * Draw a specific frame to the canvas
   * Uses requestAnimationFrame for paint-aligned rendering
   */
  const drawFrame = useCallback(
    (frameIndex: number) => {
      if (!canvasRef.current || !imagesRef.current.length) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });

      if (!ctx) return;

      const image = imagesRef.current[frameIndex];
      if (!image || !image.complete) return;

      // Cancel any pending frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule draw on next frame
      rafRef.current = requestAnimationFrame(() => {
        drawImageToCanvas(ctx, canvas, image, fitMode);
        rafRef.current = null;
      });
    },
    [fitMode]
  );

  /**
   * Handle canvas resize
   * Uses the sticky container dimensions (viewport size) not the scroll container
   */
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !stickyContainerRef.current) return;

    const canvas = canvasRef.current;
    const stickyContainer = stickyContainerRef.current;
    const rect = stickyContainer.getBoundingClientRect();

    // Use the sticky container's dimensions (100vh, full width) for the canvas
    const ctx = setupCanvas(canvas, rect.width, rect.height);

    if (ctx && imagesRef.current.length > 0) {
      // Redraw current frame after resize
      drawFrame(currentFrameRef.current);
    }

    setCanvasReady(true);
  }, [drawFrame]);

  /**
   * Initialize canvas and preload images
   */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Set up abort controller for cleanup
    abortControllerRef.current = new AbortController();

    // Initial canvas setup
    handleResize();

    // Preload images
    const loadImages = async () => {
      try {
        const images = await preloadImages(
          basePath,
          frameCount,
          priorityFrames,
          20, // chunk size
          (progress) => {
            setLoadProgress(progress);
          },
          abortControllerRef.current?.signal
        );

        imagesRef.current = images;

        // Draw first frame when loading completes
        if (images.length > 0 && canvasRef.current) {
          drawFrame(0);
          setIsLoading(false);
          onLoadComplete?.();
        }
      } catch (error) {
        if (error instanceof Error && error.message !== 'Preload aborted') {
          console.error('Failed to load images:', error);
        }
      }
    };

    loadImages();

    // Set up resize observer for responsive handling
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      resizeObserver.disconnect();
    };
  }, [basePath, frameCount, priorityFrames, drawFrame, handleResize, onLoadComplete]);

  /**
   * Subscribe to scroll progress and update frame
   * Only redraws when the frame index actually changes
   */
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest: number) => {
      // Apply slowdown transformation to progress
      const mappedProgress = applySlowdown(latest);

      // Update scroll progress for overlay (use mapped progress)
      setScrollProgress(mappedProgress);

      if (!imagesRef.current.length || isLoading) return;

      // Map scroll progress to frame index
      // Use Math.min and Math.max to ensure we stay in bounds
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(mappedProgress * frameCount))
      );

      // Only draw if frame has changed (prevents unnecessary draws)
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);

        // Trigger auto-play when reaching the trigger frame
        if (frameIndex >= autoPlayTriggerFrame && !autoPlayTriggeredRef.current) {
          triggerAutoPlay();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress, frameCount, isLoading, drawFrame, applySlowdown, autoPlayTriggerFrame, triggerAutoPlay]);

  // First frame path for instant background display
  const firstFramePath = `${basePath}frame_000_delay-0.042s.jpg`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        height: `${scrollHeight}vh`,
        position: 'relative',
      }}
    >
      {/* Sticky Canvas Container */}
      <div
        ref={stickyContainerRef}
        className="w-full h-screen overflow-hidden"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'black',
          backgroundImage: `url(${firstFramePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            display: canvasReady ? 'block' : 'none',
          }}
        />

        {/* Custom Overlay - shown after frames are loaded */}
        {!isLoading && renderOverlay && renderOverlay(scrollProgress)}
      </div>
    </div>
  );
}
