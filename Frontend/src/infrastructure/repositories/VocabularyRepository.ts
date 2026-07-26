import { BaseInMemoryRepository } from './BaseInMemoryRepository';
import type { IVocabularyRepository } from '../../domain/repositories/IVocabularyRepository';
import { Vocabulary } from '../../domain/entities/Vocabulary';
import { VocabularySearchStrategy } from '../../domain/strategies/VocabularySearchStrategy';
import type { CEFRLevel } from '../../levels/cefr';

export class VocabularyRepository
  extends BaseInMemoryRepository<Vocabulary>
  implements IVocabularyRepository
{
  protected readonly repositoryName = 'VocabularyRepository';
  private readonly searchStrategy = new VocabularySearchStrategy();

  getRandom(count = 1, level?: CEFRLevel): ReadonlyArray<Vocabulary> {
    const pool = level ? [...this.getByLevel(level)] : [...this.items];
    return Object.freeze(
      pool.sort(() => Math.random() - 0.5).slice(0, count)
    );
  }

  search(query: string, level?: CEFRLevel): ReadonlyArray<Vocabulary> {
    const pool = level ? this.getByLevel(level) : this.items;
    return this.searchStrategy.search(pool, query);
  }

  getCrossLevelLinks(word: Vocabulary): ReadonlyArray<Vocabulary> {
    const stem = word.getStem().toLowerCase();
    return this.query(
      w => w.getId() !== word.getId() && w.getStem().toLowerCase().includes(stem)
    );
  }
}
