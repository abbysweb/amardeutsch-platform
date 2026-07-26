import type { IRepository } from './IRepository';
import type { Vocabulary } from '../entities/Vocabulary';
import type { CEFRLevel } from '../../levels/cefr';

export interface IVocabularyRepository extends IRepository<Vocabulary> {
  getRandom(count?: number, level?: CEFRLevel): ReadonlyArray<Vocabulary>;
  search(query: string, level?: CEFRLevel): ReadonlyArray<Vocabulary>;
  getCrossLevelLinks(word: Vocabulary): ReadonlyArray<Vocabulary>;
}
