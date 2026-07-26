/**
 * @file SearchService.ts
 * Domain service for cross-entity search using the Strategy pattern.
 * Searches across vocabulary, grammar, and quizzes simultaneously.
 */

import type { Vocabulary } from '../entities/Vocabulary';
import type { Grammar } from '../entities/Grammar';
import type { Quiz } from '../entities/Quiz';
import type { Sentence } from '../entities/Sentence';
import { VocabularySearchStrategy } from '../strategies/VocabularySearchStrategy';
import { GrammarSearchStrategy } from '../strategies/GrammarSearchStrategy';
import { QuizSearchStrategy } from '../strategies/QuizSearchStrategy';
import { SentenceSearchStrategy } from '../strategies/SentenceSearchStrategy';

export interface SearchResults {
  vocabulary: ReadonlyArray<Vocabulary>;
  grammar: ReadonlyArray<Grammar>;
  quizzes: ReadonlyArray<Quiz>;
  sentences: ReadonlyArray<Sentence>;
  total: number;
}

export class SearchService {
  private readonly vocabStrategy = new VocabularySearchStrategy();
  private readonly grammarStrategy = new GrammarSearchStrategy();
  private readonly quizStrategy = new QuizSearchStrategy();
  private readonly sentenceStrategy = new SentenceSearchStrategy();

  searchAll(
    query: string,
    vocabPool: ReadonlyArray<Vocabulary>,
    grammarPool: ReadonlyArray<Grammar>,
    quizPool: ReadonlyArray<Quiz>,
    sentencePool: ReadonlyArray<Sentence>,
  ): SearchResults {
    const vocabulary = this.vocabStrategy.search(vocabPool, query);
    const grammar = this.grammarStrategy.search(grammarPool, query);
    const quizzes = this.quizStrategy.search(quizPool, query);
    const sentences = this.sentenceStrategy.search(sentencePool, query);

    return {
      vocabulary,
      grammar,
      quizzes,
      sentences,
      total: vocabulary.length + grammar.length + quizzes.length + sentences.length,
    };
  }
}
