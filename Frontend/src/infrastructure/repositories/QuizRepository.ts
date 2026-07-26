import { BaseInMemoryRepository } from './BaseInMemoryRepository';
import type { IQuizRepository } from '../../domain/repositories/IQuizRepository';
import { Quiz } from '../../domain/entities/Quiz';
import { QuizSearchStrategy } from '../../domain/strategies/QuizSearchStrategy';
import type { CEFRLevel } from '../../levels/cefr';

export class QuizRepository
  extends BaseInMemoryRepository<Quiz>
  implements IQuizRepository
{
  protected readonly repositoryName = 'QuizRepository';
  private readonly searchStrategy = new QuizSearchStrategy();

  getOrdered(level?: CEFRLevel): ReadonlyArray<Quiz> {
    const pool = level ? [...this.getByLevel(level)] : [...this.items];
    return Object.freeze(pool.sort((a, b) => a.getQuestionCount() - b.getQuestionCount()));
  }

  search(query: string): ReadonlyArray<Quiz> {
    return this.searchStrategy.search(this.items, query);
  }
}
