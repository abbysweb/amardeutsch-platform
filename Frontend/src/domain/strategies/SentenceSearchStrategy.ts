import type { ISearchStrategy } from './ISearchStrategy';
import type { Sentence } from '../entities/Sentence';

export class SentenceSearchStrategy implements ISearchStrategy<Sentence> {
  search(items: ReadonlyArray<Sentence>, query: string): ReadonlyArray<Sentence> {
    const q = query.toLowerCase();
    return items.filter(s =>
      s.getGerman().toLowerCase().includes(q) ||
      s.getEnglish().toLowerCase().includes(q) ||
      (s.getGrammarPoint()?.toLowerCase().includes(q) ?? false)
    );
  }
}
