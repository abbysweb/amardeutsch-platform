// Side-effect data registration into DataRegistry
import { registry } from '@/infrastructure/registry/DataRegistry';

// Vocabulary is now loaded dynamically via API.

import b2Grammar from './grammar/data.json';
import b2Quizzes from './quizzes/data.json';
import b2Sentences from './sentences/data.json';
import b2Exam from './exam/data.json';

registry.initialize([
  {
    level: 'B2',
    vocabulary: [], // loaded dynamically
    grammar: b2Grammar,
    quizzes: b2Quizzes,
    sentences: b2Sentences,
    exam: b2Exam,
  },
]);

export const b2Vocabulary: any[] = [];
export { default as b2Grammar } from './grammar/data.json';
export { default as b2Quizzes } from './quizzes/data.json';
export { default as b2Sentences } from './sentences/data.json';
export { default as b2Exam } from './exam/data.json';

export type B2Vocabulary = any[];
export type B2Grammar = typeof b2Grammar;
export type B2Quizzes = typeof b2Quizzes;
export type B2Sentences = typeof b2Sentences;
export type B2Exam = typeof b2Exam;

export const B2_STATS = {
  vocabularyCount: 0, // loaded dynamically
  grammarCount: b2Grammar.length,
  quizCount: b2Quizzes.length,
  totalQuestions: b2Quizzes.reduce((sum: number, q: any) => sum + q.questions.length, 0),
  sentenceCount: b2Sentences.length,
  examSections: b2Exam.sections.length,
  examTotalTime: b2Exam.totalTimeMinutes,
} as const;
