import type { ISearchStrategy } from './ISearchStrategy';
import type { Grammar } from '../entities/Grammar';

export class GrammarSearchStrategy implements ISearchStrategy<Grammar> {
  search(items: ReadonlyArray<Grammar>, query: string): ReadonlyArray<Grammar> {
    const q = query.toLowerCase();
    return items.filter(l =>
      l.getTitle().toLowerCase().includes(q) ||
      l.getDescription().toLowerCase().includes(q) ||
      l.getCategory().toLowerCase().includes(q) ||
      l.getContent().toLowerCase().includes(q)
    );
  }
}
