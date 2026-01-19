'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';
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
  /** Render loading state */
  renderLoader?: (progress: PreloadProgress) => React.ReactNode;
  /** Render overlay content based on scroll progress */
  renderOverlay?: (progress: number) => React.ReactNode;
  /** Callback when loading completes */
  onLoadComplete?: () => void;
  /** Optional slowdown configuration for specific sections */
  slowdown?: SlowdownConfig;
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
  renderLoader,
  renderOverlay,
  onLoadComplete,
  slowdown,
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress, frameCount, isLoading, drawFrame, applySlowdown]);

  /**
   * Default loader component
   */
  const defaultLoader = (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress.percentage}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
        <p className="text-white/60 text-sm font-medium tracking-wider">
          LOADING EXPERIENCE
        </p>
        <p className="text-white/40 text-xs mt-2">
          {loadProgress.loaded} / {loadProgress.total} frames
        </p>
      </div>
    </div>
  );

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
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            display: canvasReady ? 'block' : 'none',
          }}
        />

        {/* Loading State */}
        {isLoading && (renderLoader?.(loadProgress) || defaultLoader)}

        {/* Custom Overlay */}
        {!isLoading && renderOverlay && renderOverlay(scrollProgress)}
      </div>
    </div>
  );
}
