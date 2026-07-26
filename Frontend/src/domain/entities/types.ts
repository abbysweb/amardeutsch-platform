import type { CEFRLevel } from '../../levels/cefr';

export type ContentType = 'vocab' | 'grammar' | 'quiz' | 'sentence' | 'exam';

export type HybridKeyStr = `${string}:${ContentType}:${number | string}`;

export function makeKey(level: string, type: ContentType, id: number | string): HybridKeyStr {
  return `${level}:${type}:${id}`;
}

export function parseKey(key: HybridKeyStr): { level: string; type: ContentType; id: string } {
  const [level, type, id] = key.split(':') as [string, ContentType, string];
  return { level, type, id };
}

export interface BaseEntity {
  id: number | string;
  level: string;
  category?: string;
  readonly key?: HybridKeyStr;
  createdAt?: string;
}

export interface LearningItem extends BaseEntity {
  german: string;
  english: string;
}

export interface VocabularyWord extends LearningItem {
  article?: string;
  plural?: string;
  example?: string;
}

export interface SentencePair extends LearningItem {
  grammarPoint?: string;
  id: number;
  category: string;
}

export interface GrammarExample {
  german: string;
  english: string;
}

export interface GrammarLesson extends BaseEntity {
  title: string;
  description: string;
  content: string;
  examples: GrammarExample[];
  conjugationTable?: string[];
  errorTraps?: string[];
  testable?: boolean;
}

export interface AssessmentItem extends BaseEntity {
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz extends AssessmentItem {
  questions: QuizQuestion[];
}

export type ExamQuestionType = string;

export interface ExamQuestion {
  id: number;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  audioUrl?: string;
  points: number;
}

export interface ExamSection {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: ExamQuestion[];
  passingScore: number;
}

export interface Exam extends AssessmentItem {
  totalTimeMinutes: number;
  sections: ExamSection[];
  passingScore: number;
}

export interface LevelDataBundle {
  level: CEFRLevel;
  vocabulary: VocabularyWord[];
  grammar: GrammarLesson[];
  quizzes: Quiz[];
  sentences: SentencePair[];
  exam: Exam;
}

export interface LevelStats {
  level: CEFRLevel;
  vocabularyCount: number;
  grammarCount: number;
  quizCount: number;
  totalQuestions: number;
  sentenceCount: number;
  examSections: number;
  examTotalTime: number;
}
