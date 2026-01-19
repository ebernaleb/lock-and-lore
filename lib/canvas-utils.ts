/**
 * Canvas utilities for scroll sequence animation
 * Handles pixel-perfect rendering and responsive scaling
 */

export type FitMode = 'contain' | 'cover';

export interface DrawConfig {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  fitMode?: FitMode;
}

/**
 * Set up canvas with proper devicePixelRatio to prevent blur
 * This is critical for crisp rendering on high-DPI displays
 */
export function setupCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d', {
    alpha: false, // Performance optimization since we don't need transparency
    desynchronized: true, // Allow better performance for animations
  });

  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;

  // Set actual canvas pixel dimensions
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // Set CSS dimensions
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale context to match DPR
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return ctx;
}

/**
 * Calculate dimensions for contain/cover fit
 * This ensures consistent rendering across all frames
 */
export function calculateFitDimensions(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  fitMode: FitMode = 'contain'
): { width: number; height: number; x: number; y: number } {
  const canvasAspect = canvasWidth / canvasHeight;
  const imageAspect = imageWidth / imageHeight;

  let width: number;
  let height: number;

  if (fitMode === 'contain') {
    // Contain: entire image visible, letterboxing if needed
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      width = canvasWidth;
      height = canvasWidth / imageAspect;
    } else {
      // Image is taller than canvas
      height = canvasHeight;
      width = canvasHeight * imageAspect;
    }
  } else {
    // Cover: fill canvas, cropping if needed
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      height = canvasHeight;
      width = canvasHeight * imageAspect;
    } else {
      // Image is taller than canvas
      width = canvasWidth;
      height = canvasWidth / imageAspect;
    }
  }

  // Center the image
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;

  return { width, height, x, y };
}

/**
 * Draw image to canvas with proper fit mode
 * Uses consistent scaling to prevent flicker between frames
 */
export function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  fitMode: FitMode = 'cover'
): void {
  const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Calculate fit dimensions
  const { width, height, x, y } = calculateFitDimensions(
    canvasWidth,
    canvasHeight,
    image.naturalWidth,
    image.naturalHeight,
    fitMode
  );

  // Draw image with calculated dimensions
  ctx.drawImage(image, x, y, width, height);
}

/**
 * Clear canvas completely
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
