// Side-effect data registration into DataRegistry
import { registry } from '@/infrastructure/registry/DataRegistry';

// Vocabulary is now loaded dynamically via API.

import a2Grammar from './grammar/data.json';
import a2Quizzes from './quizzes/data.json';
import a2Sentences from './sentences/data.json';
import a2Exam from './exam/data.json';

registry.initialize([
  {
    level: 'A2',
    vocabulary: [], // loaded dynamically
    grammar: a2Grammar,
    quizzes: a2Quizzes,
    sentences: a2Sentences,
    exam: a2Exam,
  },
]);

export const a2Vocabulary: any[] = [];
export { default as a2Grammar } from './grammar/data.json';
export { default as a2Quizzes } from './quizzes/data.json';
export { default as a2Sentences } from './sentences/data.json';
export { default as a2Exam } from './exam/data.json';

export type A2Vocabulary = any[];
export type A2Grammar = typeof a2Grammar;
export type A2Quizzes = typeof a2Quizzes;
export type A2Sentences = typeof a2Sentences;
export type A2Exam = typeof a2Exam;

export const A2_STATS = {
  vocabularyCount: 0, // loaded dynamically
  grammarCount: a2Grammar.length,
  quizCount: a2Quizzes.length,
  totalQuestions: a2Quizzes.reduce((sum: number, q: any) => sum + q.questions.length, 0),
  sentenceCount: a2Sentences.length,
  examSections: a2Exam.sections.length,
  examTotalTime: a2Exam.totalTimeMinutes,
} as const;
