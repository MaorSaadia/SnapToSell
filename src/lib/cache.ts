interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
}

// Simple in-memory cache with expiration
class Cache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  // Set a value in the cache with an expiration time (in seconds)
  set<T>(key: string, value: T, expirationInSeconds: number = 3600): void {
    const now = Date.now();
    this.cache.set(key, {
      value,
      timestamp: now,
      expiresAt: now + expirationInSeconds * 1000,
    });
  }

  // Get a value from the cache (returns undefined if expired or not found)
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    // If not found or expired, return undefined
    if (!entry || entry.expiresAt < Date.now()) {
      if (entry) {
        this.delete(key); // Clean up expired entry
      }
      return undefined;
    }

    return entry.value as T;
  }

  // Delete a key from the cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  // Clear the entire cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
const globalCache = new Cache();

// Set up periodic cleanup (every 15 minutes)
if (typeof window !== "undefined") {
  setInterval(() => {
    globalCache.cleanup();
  }, 15 * 60 * 1000);
}

export default globalCache;
