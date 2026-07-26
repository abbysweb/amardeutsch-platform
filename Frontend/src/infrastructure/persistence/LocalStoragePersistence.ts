/**
 * @file LocalStoragePersistence.ts
 * Abstraction over localStorage for progress, bookmarks, and quiz scores.
 * All reads/writes go through this layer for testability and future migration.
 */

import { Logger } from '../logger/Logger';

export interface PersistenceEntry<T> {
  value: T;
  timestamp: number;
}

export class LocalStoragePersistence {
  private readonly prefix: string;
  private readonly storage: Storage | undefined;

  constructor(
    prefix = 'german-learn',
    storage: Storage | undefined = typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : undefined
  ) {
    this.prefix = prefix;
    this.storage = storage;
  }

  private prefixed(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get<T>(key: string): T | undefined {
    try {
      const raw = this.storage?.getItem(this.prefixed(key));
      if (raw === null || raw === undefined) return undefined;
      const entry = JSON.parse(raw) as PersistenceEntry<T>;
      return entry.value;
    } catch {
      return undefined;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storage) return;
    try {
      const entry: PersistenceEntry<T> = { value, timestamp: Date.now() };
      this.storage.setItem(this.prefixed(key), JSON.stringify(entry));
    } catch (e) {
      Logger.warn('LocalStoragePersistence', `Failed to set ${key}`, e);
    }
  }

  remove(key: string): void {
    this.storage?.removeItem(this.prefixed(key));
  }

  has(key: string): boolean {
    return this.storage?.getItem(this.prefixed(key)) !== null && this.storage?.getItem(this.prefixed(key)) !== undefined;
  }

  keys(): string[] {
    if (!this.storage) return [];
    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const k = this.storage.key(i);
      if (k?.startsWith(this.prefix)) {
        result.push(k.slice(this.prefix.length + 1));
      }
    }
    return result;
  }

  clear(): void {
    for (const key of this.keys()) {
      this.storage?.removeItem(this.prefixed(key));
    }
  }

  clearPrefix(prefix: string): void {
    for (const key of this.keys()) {
      if (key.startsWith(prefix)) {
        this.storage?.removeItem(this.prefixed(key));
      }
    }
  }
}

export const progressPersistence = new LocalStoragePersistence('progress');
export const bookmarkPersistence = new LocalStoragePersistence('bookmark');
export const quizScorePersistence = new LocalStoragePersistence('quiz-score');
