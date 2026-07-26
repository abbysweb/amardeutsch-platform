/**
 * @file BaseInMemoryRepository.ts
 * Abstract base repository providing hybrid-key indexing and caching.
 * All concrete repositories extend this — Template Method pattern.
 */

import type { IRepository } from '../../domain/repositories/IRepository';
import type { BaseEntity } from '../../domain/entities/BaseEntity';
import type { HybridKey } from '../../domain/valueObjects/HybridKey';
import type { CEFRLevel } from '../../levels/cefr';
import { MemoryCache } from '../cache/MemoryCache';
import { Logger } from '../logger/Logger';

export abstract class BaseInMemoryRepository<T extends BaseEntity>
  implements IRepository<T>
{
  protected readonly items: ReadonlyArray<T>;
  protected readonly keyIndex: ReadonlyMap<string, T>;
  protected readonly cache: MemoryCache<string, ReadonlyArray<T>>;
  protected abstract readonly repositoryName: string;

  constructor(items: T[]) {
    this.items = Object.freeze([...items]);
    const index = new Map<string, T>();
    for (const item of items) {
      index.set(item.getKey().toString(), item);
    }
    this.keyIndex = index;
    this.cache = new MemoryCache<string, ReadonlyArray<T>>(
      this.constructor.name,
      5 * 60 * 1000,  // 5 minute TTL
    );
    Logger.debug(this.constructor.name, `Initialised with ${items.length} items`);
  }

  getAll(): ReadonlyArray<T> {
    return this.items;
  }

  getById(id: number | string): T | undefined {
    return this.items.find(x => x.getId() === id);
  }

  getByKey(key: HybridKey): T | undefined {
    return this.keyIndex.get(key.toString());
  }

  getByLevel(level: CEFRLevel): ReadonlyArray<T> {
    const cacheKey = `level:${level}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    const result = Object.freeze(this.items.filter(x => x.getLevel() === level));
    this.cache.set(cacheKey, result);
    return result;
  }

  getByCategory(category: string): ReadonlyArray<T> {
    const cacheKey = `cat:${category.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    const lower = category.toLowerCase();
    const result = Object.freeze(this.items.filter(x => x.getCategory().toLowerCase() === lower));
    this.cache.set(cacheKey, result);
    return result;
  }

  query(predicate: (item: T) => boolean): ReadonlyArray<T> {
    return Object.freeze(this.items.filter(predicate));
  }

  count(): number {
    return this.items.length;
  }
}
