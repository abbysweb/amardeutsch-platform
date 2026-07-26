import type { IRepository } from './IRepository';
import type { Sentence } from '../entities/Sentence';
import type { CEFRLevel } from '../../levels/cefr';

export interface ISentenceRepository extends IRepository<Sentence> {
  getByGrammarPoint(point: string): ReadonlyArray<Sentence>;
  getRandom(count?: number, level?: CEFRLevel): ReadonlyArray<Sentence>;
  search(query: string): ReadonlyArray<Sentence>;
}
