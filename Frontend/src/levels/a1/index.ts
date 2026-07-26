// Side-effect data registration into DataRegistry
import { registry } from '@/infrastructure/registry/DataRegistry';

// Vocabulary is now loaded dynamically via API.
import a1Grammar from './grammar/data.json';
import a1QuizzesData from './quizzes/data.json';
import a1QuizzesBatch2 from './quizzes/batch2.json';
import a1QuizzesBatch5 from './quizzes/batch5.json';
import a1QuizzesBatch6 from './quizzes/batch6.json';
import a1QuizzesBatch7 from './quizzes/batch7.json';
import a1QuizzesBatch8 from './quizzes/batch8.json';
import a1QuizzesBatch9 from './quizzes/batch9.json';
import a1QuizzesBatch10 from './quizzes/batch10.json';
import a1Sentences from './sentences/data.json';
import a1Exam from './exam/data.json';

export const a1Quizzes = [
  ...a1QuizzesData,
  ...a1QuizzesBatch2,
  ...a1QuizzesBatch5,
  ...a1QuizzesBatch6,
  ...a1QuizzesBatch7,
  ...a1QuizzesBatch8,
  ...a1QuizzesBatch9,
  ...a1QuizzesBatch10,
];

registry.initialize([
  {
    level: 'A1',
    vocabulary: [], // loaded dynamically
    grammar: a1Grammar,
    quizzes: a1Quizzes,
    sentences: a1Sentences,
    exam: a1Exam,
  },
]);

export const a1Vocabulary: any[] = [];
export { default as a1Grammar } from './grammar/data.json';
export { default as a1Sentences } from './sentences/data.json';
export { default as a1Exam } from './exam/data.json';

export type A1Vocabulary = any[];
export type A1Grammar = typeof a1Grammar;
export type A1Quizzes = typeof a1Quizzes;
export type A1Sentences = typeof a1Sentences;
export type A1Exam = typeof a1Exam;

export const A1_STATS = {
  vocabularyCount: 0, // loaded dynamically
  grammarCount: a1Grammar.length,
  quizCount: a1Quizzes.length,
  totalQuestions: a1Quizzes.reduce((sum: number, q: any) => sum + (q.questions?.length || 0), 0),
  sentenceCount: a1Sentences.length,
  examSections: a1Exam.sections.length,
  examTotalTime: a1Exam.totalTimeMinutes,
} as const;

