/**
 * Image preloading utilities for scroll sequence animation
 * Implements chunked, prioritized loading to prevent main thread blocking
 */

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type PreloadCallback = (progress: PreloadProgress) => void;

/**
 * Preload a single image and return an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Preload images in chunks to prevent blocking the main thread
 * Priority loading: first N frames load immediately, rest load in batches
 *
 * @param basePath - Base path for images (e.g., '/sequence/')
 * @param count - Total number of frames
 * @param priorityCount - Number of frames to load immediately (default 10)
 * @param chunkSize - Number of images to load per batch (default 20)
 * @param onProgress - Callback for progress updates
 * @param signal - AbortSignal for cancellation
 */
export async function preloadImages(
  basePath: string,
  count: number,
  priorityCount = 10,
  chunkSize = 20,
  onProgress?: PreloadCallback,
  signal?: AbortSignal
): Promise<HTMLImageElement[]> {
  const images: (HTMLImageElement | null)[] = new Array(count).fill(null);
  let loadedCount = 0;

  const updateProgress = () => {
    if (onProgress) {
      onProgress({
        loaded: loadedCount,
        total: count,
        percentage: Math.round((loadedCount / count) * 100),
      });
    }
  };

  // Helper to get the image path
  // New format: frame_XXX_delay-0.042s.jpg (or 0.041s for every 3rd frame starting at index 1)
  const getImagePath = (index: number): string => {
    const paddedNum = String(index).padStart(3, '0');
    const delay = index % 3 === 1 ? '0.041s' : '0.042s';
    return `${basePath}frame_${paddedNum}_delay-${delay}.jpg`;
  };

  // Check if operation was aborted
  const checkAbort = () => {
    if (signal?.aborted) {
      throw new Error('Preload aborted');
    }
  };

  // Phase 1: Load priority frames (first N frames) immediately
  const priorityPromises = [];
  for (let i = 0; i < Math.min(priorityCount, count); i++) {
    checkAbort();

    const imagePath = getImagePath(i);
    priorityPromises.push(
      loadImage(imagePath).then((img) => {
        images[i] = img;
        loadedCount++;
        updateProgress();
        return img;
      }).catch((err) => {
        console.error(`Failed to load priority frame ${i} at ${imagePath}:`, err);
        throw err;
      })
    );
  }

  await Promise.all(priorityPromises);
  checkAbort();

  // Phase 2: Load remaining frames in chunks using requestIdleCallback
  const loadChunk = async (startIdx: number, endIdx: number) => {
    checkAbort();

    const chunkPromises = [];
    for (let i = startIdx; i < endIdx && i < count; i++) {
      const imagePath = getImagePath(i);
      chunkPromises.push(
        loadImage(imagePath).then((img) => {
          images[i] = img;
          loadedCount++;
          updateProgress();
          return img;
        }).catch((err) => {
          console.error(`Failed to load frame ${i} at ${imagePath}:`, err);
          throw err;
        })
      );
    }

    await Promise.all(chunkPromises);
  };

  // Load remaining frames in chunks
  const remainingFrames = count - priorityCount;
  const chunksNeeded = Math.ceil(remainingFrames / chunkSize);

  for (let chunk = 0; chunk < chunksNeeded; chunk++) {
    checkAbort();

    const startIdx = priorityCount + chunk * chunkSize;
    const endIdx = Math.min(startIdx + chunkSize, count);

    // Use requestIdleCallback if available, otherwise setTimeout
    await new Promise<void>((resolve) => {
      const callback = () => {
        loadChunk(startIdx, endIdx).then(resolve);
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
      } else {
        setTimeout(callback, 0);
      }
    });
  }

  checkAbort();

  return images.filter((img): img is HTMLImageElement => img !== null);
}
