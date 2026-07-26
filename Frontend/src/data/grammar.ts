/**
 * @file grammar.ts
 * @description Aggregated grammar + quiz data across ALL CEFR levels.
 * This replaces the old A1-only export.
 *
 * Import via: import { allGrammar, allQuizzes } from '@/data/grammar'
 * Or level-scoped: import { a2Grammar } from '@/levels/a2'
 */

import type { GrammarLesson, Quiz } from '@/domain/entities/types';

import { a1Grammar, a1Quizzes } from '@/levels/a1';
import { a2Grammar, a2Quizzes } from '@/levels/a2';
import { b1Grammar, b1Quizzes } from '@/levels/b1';
import { b2Grammar, b2Quizzes } from '@/levels/b2';

// ─── Per-level re-exports (named) ────────────────────────────────────────────
export { a1Grammar, a1Quizzes } from '@/levels/a1';
export { a2Grammar, a2Quizzes } from '@/levels/a2';
export { b1Grammar, b1Quizzes } from '@/levels/b1';
export { b2Grammar, b2Quizzes } from '@/levels/b2';

// ─── Cross-level aggregates ───────────────────────────────────────────────────

/** All grammar lessons across A1–B2 in level order */
export const allGrammar: GrammarLesson[] = [
  ...(a1Grammar as GrammarLesson[]),
  ...(a2Grammar as GrammarLesson[]),
  ...(b1Grammar as GrammarLesson[]),
  ...(b2Grammar as GrammarLesson[]),
];

/** All quizzes across A1–B2 in level order */
export const allQuizzes: Quiz[] = [
  ...(a1Quizzes as Quiz[]),
  ...(a2Quizzes as Quiz[]),
  ...(b1Quizzes as Quiz[]),
  ...(b2Quizzes as Quiz[]),
];

// ─── Backwards-compatible aliases (do NOT use in new code) ───────────────────
/** @deprecated Use allGrammar or level-specific a1Grammar/a2Grammar etc. */
export const grammarLessons = allGrammar;

/** @deprecated Use allQuizzes or level-specific a1Quizzes etc. */
export const quizzes = allQuizzes;