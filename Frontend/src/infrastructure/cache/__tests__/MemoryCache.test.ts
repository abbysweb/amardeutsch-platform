import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryCache } from '../MemoryCache';

describe('MemoryCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves values', () => {
    const cache = new MemoryCache<string, string>('test', 60_000);
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('returns undefined for missing keys', () => {
    const cache = new MemoryCache<string, string>('test');
    expect(cache.get('missing')).toBeUndefined();
  });

  it('respects TTL expiry', () => {
    const cache = new MemoryCache<string, string>('ttl', 10_000);
    cache.set('key', 'val');
    expect(cache.get('key')).toBe('val');
    vi.advanceTimersByTime(10_001);
    expect(cache.get('key')).toBeUndefined();
  });

  it('evicts oldest entry when over max size', () => {
    const cache = new MemoryCache<string, string>('evict', 60_000, 2);
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe('2');
    expect(cache.get('c')).toBe('3');
  });

  it('invalidate removes a key', () => {
    const cache = new MemoryCache<string, string>('inv', 60_000);
    cache.set('key', 'val');
    cache.invalidate('key');
    expect(cache.get('key')).toBeUndefined();
  });

  it('clear removes all', () => {
    const cache = new MemoryCache<string, string>('clr', 60_000);
    cache.set('a', '1');
    cache.set('b', '2');
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
