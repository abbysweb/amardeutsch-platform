import type { ISearchStrategy } from './ISearchStrategy';
import type { Vocabulary } from '../entities/Vocabulary';

export class VocabularySearchStrategy implements ISearchStrategy<Vocabulary> {
  search(items: ReadonlyArray<Vocabulary>, query: string): ReadonlyArray<Vocabulary> {
    const q = query.toLowerCase();
    return items.filter(w =>
      w.getGerman().toLowerCase().includes(q) ||
      w.getEnglish().toLowerCase().includes(q) ||
      w.getCategory().toLowerCase().includes(q) ||
      (w.getArticle()?.toLowerCase().includes(q) ?? false)
    );
  }
}
