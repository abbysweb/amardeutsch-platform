import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStoragePersistence } from '../LocalStoragePersistence';

describe('LocalStoragePersistence', () => {
  let storage: LocalStoragePersistence;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStoragePersistence('test');
  });

  it('stores and retrieves values', () => {
    storage.set('key1', { data: 'hello' });
    expect(storage.get('key1')).toEqual({ data: 'hello' });
  });

  it('returns undefined for missing keys', () => {
    expect(storage.get('nonexistent')).toBeUndefined();
  });

  it('checks if a key exists', () => {
    storage.set('exists', true);
    expect(storage.has('exists')).toBe(true);
    expect(storage.has('missing')).toBe(false);
  });

  it('returns all keys without internal prefix', () => {
    storage.set('a', 1);
    storage.set('b', 2);
    expect(storage.keys()).toEqual(['a', 'b']);
  });

  it('removes a key via remove()', () => {
    storage.set('del', 'value');
    storage.remove('del');
    expect(storage.get('del')).toBeUndefined();
  });

  it('clears all prefixed keys', () => {
    storage.set('x', 1);
    storage.set('y', 2);
    storage.clear();
    expect(storage.keys()).toHaveLength(0);
  });

  it('clears keys by prefix', () => {
    storage.set('alpha:1', 'a');
    storage.set('alpha:2', 'b');
    storage.set('beta:1', 'c');
    storage.clearPrefix('alpha');
    expect(storage.keys()).toEqual(['beta:1']);
  });

  it('does not interfere with other prefixes', () => {
    const other = new LocalStoragePersistence('other');
    storage.set('shared', 'v1');
    other.set('shared', 'v2');
    expect(storage.get('shared')).toBe('v1');
    expect(other.get('shared')).toBe('v2');
  });
});
