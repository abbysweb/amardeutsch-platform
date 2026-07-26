/**
 * @file SchemaValidator.ts
 * Zod schemas for runtime JSON validation.
 * Every JSON bundle passes through here before entering the registry.
 * Never trust imported JSON — always validate at the boundary.
 */

import { z } from 'zod';
import { Logger } from '../logger/Logger';
import { CEFR_ZOD_ENUM } from '../../levels/config';

const CEFR_ENUM = z.enum(CEFR_ZOD_ENUM);

// ─────────────────────────────────────────────────────────────────────────────
// VOCABULARY SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const VocabularySchema = z.object({
  id: z.union([z.number(), z.string()]),
  level: CEFR_ENUM,
  category: z.string().min(1),
  german: z.string().min(1),
  english: z.string().min(1),
  article: z.string().optional(),
  plural: z.string().optional(),
  example: z.string().optional(),
});

export const VocabularyArraySchema = z.array(VocabularySchema);

// ─────────────────────────────────────────────────────────────────────────────
// GRAMMAR SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const GrammarExampleSchema = z.object({
  german: z.string().min(1),
  english: z.string().min(1),
});

export const GrammarSchema = z.object({
  id: z.union([z.number(), z.string()]),
  level: CEFR_ENUM,
  category: z.string(),
  title: z.string().min(1),
  description: z.string(),
  content: z.string().min(1),
  examples: z.array(GrammarExampleSchema),
  conjugationTable: z.array(z.string()).optional(),
  errorTraps: z.array(z.string()).optional(),
  testable: z.boolean().optional(),
});

export const GrammarArraySchema = z.array(GrammarSchema);

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const QuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(1),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string().optional(),
});

export const QuizSchema = z.object({
  id: z.union([z.number(), z.string()]),
  level: CEFR_ENUM,
  category: z.string(),
  title: z.string().min(1),
  description: z.string(),
  questions: z.array(z.any()),  // flexible for legacy data shapes
});

export const QuizArraySchema = z.array(QuizSchema);

// ─────────────────────────────────────────────────────────────────────────────
// SENTENCE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const SentenceSchema = z.object({
  id: z.union([z.number(), z.string()]),
  level: CEFR_ENUM,
  category: z.string(),
  german: z.string().min(1),
  english: z.string().min(1),
  grammarPoint: z.string().optional(),
});

export const SentenceArraySchema = z.array(SentenceSchema);

// ─────────────────────────────────────────────────────────────────────────────
// EXAM SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const ExamQuestionSchema = z.object({
  id: z.number(),
  type: z.enum(['multiple-choice', 'fill-blank', 'translation', 'speaking']),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  explanation: z.string().optional(),
  points: z.number().min(0),
});

export const ExamSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  timeLimitMinutes: z.number(),
  questions: z.array(ExamQuestionSchema),
  passingScore: z.number(),
});

export const ExamSchema = z.object({
  id: z.string(),
  level: CEFR_ENUM,
  title: z.string().min(1),
  description: z.string(),
  totalTimeMinutes: z.number(),
  sections: z.array(ExamSectionSchema),
  passingScore: z.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATOR CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class SchemaValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateVocabulary(raw: unknown): any[] {
    const result = VocabularyArraySchema.safeParse(raw);
    if (!result.success) {
      Logger.warn('SchemaValidator', 'Vocabulary validation issues', result.error.issues.slice(0, 3));
      // Permissive: filter out invalid items, keep valid ones
      if (Array.isArray(raw)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (raw as any[]).filter(item => VocabularySchema.safeParse(item).success);
      }
      return [];
    }
    return result.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateGrammar(raw: unknown): any[] {
    const result = GrammarArraySchema.safeParse(raw);
    if (!result.success) {
      Logger.warn('SchemaValidator', 'Grammar validation issues', result.error.issues.slice(0, 3));
      if (Array.isArray(raw)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (raw as any[]).filter(item => GrammarSchema.safeParse(item).success);
      }
      return [];
    }
    return result.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateQuizzes(raw: unknown): any[] {
    const result = QuizArraySchema.safeParse(raw);
    if (!result.success) {
      Logger.warn('SchemaValidator', 'Quiz validation issues', result.error.issues.slice(0, 3));
      if (Array.isArray(raw)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (raw as any[]).filter(item => QuizSchema.safeParse(item).success);
      }
      return [];
    }
    return result.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateSentences(raw: unknown): any[] {
    const result = SentenceArraySchema.safeParse(raw);
    if (!result.success) {
      Logger.warn('SchemaValidator', 'Sentence validation issues', result.error.issues.slice(0, 3));
      if (Array.isArray(raw)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (raw as any[]).filter(item => SentenceSchema.safeParse(item).success);
      }
      return [];
    }
    return result.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateExam(raw: unknown): any | null {
    const result = ExamSchema.safeParse(raw);
    if (!result.success) {
      Logger.warn('SchemaValidator', 'Exam validation issues', result.error.issues.slice(0, 3));
      return null;
    }
    return result.data;
  }
}
