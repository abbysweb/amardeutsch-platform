import type { BaseEntity } from '../entities/BaseEntity';
import type { HybridKey } from '../valueObjects/HybridKey';
import type { CEFRLevel } from '../../levels/cefr';

export interface IRepository<T extends BaseEntity> {
  getAll(): ReadonlyArray<T>;
  getById(id: number | string): T | undefined;
  getByKey(key: HybridKey): T | undefined;
  getByLevel(level: CEFRLevel): ReadonlyArray<T>;
  getByCategory(category: string): ReadonlyArray<T>;
  query(predicate: (item: T) => boolean): ReadonlyArray<T>;
  count(): number;
}
