import { BaseInMemoryRepository } from './BaseInMemoryRepository';
import type { IGrammarRepository } from '../../domain/repositories/IGrammarRepository';
import { Grammar } from '../../domain/entities/Grammar';
import { GrammarSearchStrategy } from '../../domain/strategies/GrammarSearchStrategy';
import type { CEFRLevel } from '../../levels/cefr';

export class GrammarRepository
  extends BaseInMemoryRepository<Grammar>
  implements IGrammarRepository
{
  protected readonly repositoryName = 'GrammarRepository';
  private readonly searchStrategy = new GrammarSearchStrategy();

  getTestable(level?: CEFRLevel): ReadonlyArray<Grammar> {
    const pool = level ? this.getByLevel(level) : this.items;
    return Object.freeze(pool.filter(l => l.isTestable()));
  }

  search(query: string, level?: CEFRLevel): ReadonlyArray<Grammar> {
    const pool = level ? this.getByLevel(level) : this.items;
    return this.searchStrategy.search(pool, query);
  }
}
