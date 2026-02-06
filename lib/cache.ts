/**
 * In-memory cache with TTL support for server-side data.
 *
 * Used to reduce redundant calls to the OTC API for data that changes
 * infrequently (game listings, pricing) or can tolerate short staleness
 * windows (availability, booking counts).
 *
 * IMPORTANT: This cache lives in the Node.js process memory. In serverless
 * environments (Vercel), each function invocation may or may not share
 * the same process, so cache hits are best-effort. The TTL values are
 * chosen to be short enough that stale data is acceptable.
 *
 * For production at scale, consider replacing this with Redis or a
 * similar distributed cache.
 */

interface CacheEntry<T> {
  data: T;
  /** Unix timestamp (ms) when this entry expires */
  expires_at: number;
  /** Unix timestamp (ms) when this entry was created */
  created_at: number;
}

/** Default TTL values in seconds for different data categories */
export const CACHE_TTL = {
  /** Game listings change rarely -- cache for 5 minutes */
  GAMES: 5 * 60,
  /** Pricing may change occasionally -- cache for 5 minutes */
  PRICING: 5 * 60,
  /** Availability changes frequently -- cache for 60 seconds */
  AVAILABILITY: 60,
  /** Booking activity for social proof -- cache for 2 minutes */
  ACTIVITY: 2 * 60,
  /** Gift card balance -- cache for 30 seconds */
  GIFT_CARD: 30,
} as const;

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /**
   * Maximum number of entries to prevent unbounded memory growth.
   * When exceeded, the oldest entries are evicted.
   */
  private maxEntries = 500;

  /**
   * Retrieve a cached value if it exists and has not expired.
   * Returns undefined on cache miss or expiration.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expires_at) {
      // Entry expired -- remove and return miss
      this.store.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Store a value in the cache with a TTL in seconds.
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Evict oldest entries if we're at capacity
    if (this.store.size >= this.maxEntries) {
      this.evictOldest();
    }

    const now = Date.now();
    this.store.set(key, {
      data,
      expires_at: now + ttlSeconds * 1000,
      created_at: now,
    });
  }

  /**
   * Invalidate a specific cache key.
   */
  invalidate(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Invalidate all cache keys matching a prefix.
   * Useful for clearing all availability data for a game, etc.
   */
  invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get current cache statistics for monitoring.
   */
  stats(): { size: number; maxEntries: number } {
    return {
      size: this.store.size,
      maxEntries: this.maxEntries,
    };
  }

  /**
   * Remove expired entries proactively.
   * Called periodically or can be triggered manually.
   */
  prune(): number {
    const now = Date.now();
    let pruned = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expires_at) {
        this.store.delete(key);
        pruned++;
      }
    }
    return pruned;
  }

  /**
   * Evict the oldest 10% of entries when at capacity.
   */
  private evictOldest(): void {
    const entriesToRemove = Math.max(1, Math.floor(this.maxEntries * 0.1));
    const sortedEntries = [...this.store.entries()].sort(
      (a, b) => a[1].created_at - b[1].created_at
    );

    for (let i = 0; i < entriesToRemove && i < sortedEntries.length; i++) {
      this.store.delete(sortedEntries[i][0]);
    }
  }
}

/**
 * Singleton cache instance shared across the application.
 *
 * Using a module-level singleton ensures all server-side code within the
 * same Node.js process shares one cache, while being safe for serverless
 * environments where the process may be recycled.
 */
export const cache = new MemoryCache();

// ---------------------------------------------------------------------------
// Cache key generators
// ---------------------------------------------------------------------------

/** Generate a cache key for game availability */
export function availabilityCacheKey(gameId: number, date: string): string {
  return `availability:${gameId}:${date}`;
}

/** Generate a cache key for game activity/social proof */
export function activityCacheKey(gameId: number): string {
  return `activity:${gameId}`;
}

/** Generate a cache key for game pricing */
export function pricingCacheKey(gameId: number): string {
  return `pricing:${gameId}`;
}

/** Generate a cache key for game listings */
export function gamesCacheKey(params?: string): string {
  return `games:${params || 'default'}`;
}

/** Generate a cache key for gift card balance */
export function giftCardCacheKey(code: string): string {
  return `giftcard:${code}`;
}
