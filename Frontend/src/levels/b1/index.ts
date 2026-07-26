// Side-effect data registration into DataRegistry
import { registry } from '@/infrastructure/registry/DataRegistry';

// Vocabulary is now loaded dynamically via API.

import b1Grammar from './grammar/data.json';
import b1Quizzes from './quizzes/data.json';
import b1Sentences from './sentences/data.json';
import b1Exam from './exam/data.json';

registry.initialize([
  {
    level: 'B1',
    vocabulary: [], // loaded dynamically
    grammar: b1Grammar,
    quizzes: b1Quizzes,
    sentences: b1Sentences,
    exam: b1Exam,
  },
]);

export const b1Vocabulary: any[] = [];
export { default as b1Grammar } from './grammar/data.json';
export { default as b1Quizzes } from './quizzes/data.json';
export { default as b1Sentences } from './sentences/data.json';
export { default as b1Exam } from './exam/data.json';

export type B1Vocabulary = any[];
export type B1Grammar = typeof b1Grammar;
export type B1Quizzes = typeof b1Quizzes;
export type B1Sentences = typeof b1Sentences;
export type B1Exam = typeof b1Exam;

export const B1_STATS = {
  vocabularyCount: 0, // loaded dynamically
  grammarCount: b1Grammar.length,
  quizCount: b1Quizzes.length,
  totalQuestions: b1Quizzes.reduce((sum: number, q: any) => sum + q.questions.length, 0),
  sentenceCount: b1Sentences.length,
  examSections: b1Exam.sections.length,
  examTotalTime: b1Exam.totalTimeMinutes,
} as const;
