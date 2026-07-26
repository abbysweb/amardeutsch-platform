import type { ISearchStrategy } from './ISearchStrategy';
import type { Quiz } from '../entities/Quiz';

export class QuizSearchStrategy implements ISearchStrategy<Quiz> {
  search(items: ReadonlyArray<Quiz>, query: string): ReadonlyArray<Quiz> {
    const q = query.toLowerCase();
    return items.filter(z =>
      z.getTitle().toLowerCase().includes(q) ||
      z.getDescription().toLowerCase().includes(q)
    );
  }
}
