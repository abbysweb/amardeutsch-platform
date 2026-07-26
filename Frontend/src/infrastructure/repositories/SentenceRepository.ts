import { BaseInMemoryRepository } from './BaseInMemoryRepository';
import type { ISentenceRepository } from '../../domain/repositories/ISentenceRepository';
import { Sentence } from '../../domain/entities/Sentence';
import type { CEFRLevel } from '../../levels/cefr';

export class SentenceRepository
  extends BaseInMemoryRepository<Sentence>
  implements ISentenceRepository
{
  protected readonly repositoryName = 'SentenceRepository';

  getByGrammarPoint(point: string): ReadonlyArray<Sentence> {
    const q = point.toLowerCase();
    return this.query(s => (s.getGrammarPoint() ?? '').toLowerCase().includes(q));
  }

  getRandom(count = 1, level?: CEFRLevel): ReadonlyArray<Sentence> {
    const pool = level ? [...this.getByLevel(level)] : [...this.items];
    return Object.freeze(pool.sort(() => Math.random() - 0.5).slice(0, count));
  }

  search(query: string): ReadonlyArray<Sentence> {
    const q = query.toLowerCase();
    return this.query(s => s.getSearchTokens().some(t => t.includes(q)));
  }
}
