/**
 * @file MemoryCache.ts
 * Generic TTL-based in-memory cache.
 * Used by repositories to avoid re-computing expensive queries.
 * O(1) get/set via Map.
 */

import { Logger } from '../logger/Logger';

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export class MemoryCache<K extends string, V> {
  private readonly store = new Map<K, CacheEntry<V>>();
  private readonly ttlMs: number;
  private readonly maxSize: number;
  private readonly name: string;

  constructor(name: string, ttlMs = 5 * 60 * 1000, maxSize = 500) {
    this.name = name;
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.store.size >= this.maxSize) {
      // Evict oldest entry (FIFO)
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) {
        this.store.delete(firstKey);
        Logger.debug(this.name, `Cache eviction: removed ${firstKey}`);
      }
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: K): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  invalidate(key: K): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
    Logger.debug(this.name, 'Cache cleared');
  }

  get size(): number {
    return this.store.size;
  }
}
