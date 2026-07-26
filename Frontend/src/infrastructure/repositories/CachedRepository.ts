/**
 * Decorator Pattern — wraps any IRepository with caching.
 * All read methods check the cache first, then delegate to the wrapped repository.
 */

import type { IRepository } from '../../domain/repositories/IRepository';
import type { BaseEntity } from '../../domain/entities/BaseEntity';
import type { HybridKey } from '../../domain/valueObjects/HybridKey';
import type { CEFRLevel } from '../../levels/cefr';
import { MemoryCache } from '../cache/MemoryCache';
import { Logger } from '../logger/Logger';

export class CachedRepository<T extends BaseEntity> implements IRepository<T> {
  private readonly cache: MemoryCache<string, ReadonlyArray<T>>;
  private readonly singleCache: MemoryCache<string, T | undefined>;

  constructor(
    private readonly wrapped: IRepository<T>,
    name: string,
    ttlMs = 5 * 60 * 1000,
  ) {
    this.cache = new MemoryCache<string, ReadonlyArray<T>>(`${name}_list`, ttlMs);
    this.singleCache = new MemoryCache<string, T | undefined>(`${name}_single`, ttlMs);
    Logger.debug('CachedRepository', `Wrapping ${name}`);
  }

  getAll(): ReadonlyArray<T> {
    const cached = this.cache.get('all');
    if (cached) return cached;
    const result = this.wrapped.getAll();
    this.cache.set('all', result);
    return result;
  }

  getById(id: number | string): T | undefined {
    const key = `id:${id}`;
    const cached = this.singleCache.get(key);
    if (cached !== undefined) return cached;
    const result = this.wrapped.getById(id);
    this.singleCache.set(key, result);
    return result;
  }

  getByKey(key: HybridKey): T | undefined {
    const cacheKey = `key:${key.toString()}`;
    const cached = this.singleCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const result = this.wrapped.getByKey(key);
    this.singleCache.set(cacheKey, result);
    return result;
  }

  getByLevel(level: CEFRLevel): ReadonlyArray<T> {
    const cacheKey = `level:${level}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    const result = this.wrapped.getByLevel(level);
    this.cache.set(cacheKey, result);
    return result;
  }

  getByCategory(category: string): ReadonlyArray<T> {
    const cacheKey = `cat:${category.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    const result = this.wrapped.getByCategory(category);
    this.cache.set(cacheKey, result);
    return result;
  }

  query(predicate: (item: T) => boolean): ReadonlyArray<T> {
    return this.wrapped.query(predicate);
  }

  count(): number {
    return this.wrapped.count();
  }

  invalidateAll(): void {
    this.cache.clear();
    this.singleCache.clear();
  }
}
