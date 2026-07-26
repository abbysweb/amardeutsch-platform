import type { IRepository } from './IRepository';
import type { Quiz } from '../entities/Quiz';
import type { CEFRLevel } from '../../levels/cefr';

export interface IQuizRepository extends IRepository<Quiz> {
  getOrdered(level?: CEFRLevel): ReadonlyArray<Quiz>;
}
