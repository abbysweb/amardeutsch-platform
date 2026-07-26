import type { BaseEntity } from '../entities/BaseEntity';

export interface ISearchStrategy<T extends BaseEntity> {
  search(items: ReadonlyArray<T>, query: string): ReadonlyArray<T>;
}
