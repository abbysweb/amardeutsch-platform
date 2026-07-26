import type { IRepository } from './IRepository';
import type { Grammar } from '../entities/Grammar';
import type { CEFRLevel } from '../../levels/cefr';

export interface IGrammarRepository extends IRepository<Grammar> {
  getTestable(level?: CEFRLevel): ReadonlyArray<Grammar>;
}
