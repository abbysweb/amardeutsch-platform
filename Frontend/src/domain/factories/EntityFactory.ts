import { Vocabulary } from '../entities/Vocabulary';
import { Grammar } from '../entities/Grammar';
import { Quiz } from '../entities/Quiz';
import { Sentence } from '../entities/Sentence';
import { Exam } from '../entities/Exam';
import type { CEFRLevel } from '../../levels/cefr';
import { Logger } from '../../infrastructure/logger/Logger';

export class EntityFactory {
  static createVocabulary(raw: Record<string, unknown>): Vocabulary {
    return new Vocabulary({
      id: raw.id as number | string,
      level: raw.level as CEFRLevel,
      category: (raw.category as string) ?? '',
      german: raw.german as string,
      english: raw.english as string,
      article: raw.article as string | undefined,
      plural: raw.plural as string | undefined,
      example: raw.example as string | undefined,
    });
  }

  static createVocabularyBatch(raw: Record<string, unknown>[]): Vocabulary[] {
    return raw.map(r => {
      try {
        return EntityFactory.createVocabulary(r);
      } catch (e) {
        Logger.warn('EntityFactory', `Skipping invalid vocabulary item: ${String(r.id)}`, e);
        return null;
      }
    }).filter(Boolean) as Vocabulary[];
  }

  static createGrammar(raw: Record<string, unknown>): Grammar {
    return new Grammar({
      id: raw.id as number | string,
      level: raw.level as CEFRLevel,
      category: (raw.category as string) ?? '',
      title: raw.title as string,
      description: (raw.description as string) ?? '',
      content: raw.content as string,
      examples: (raw.examples as { german: string; english: string }[]) ?? [],
      conjugationTable: raw.conjugationTable as string[] | undefined,
      errorTraps: raw.errorTraps as string[] | undefined,
      testable: raw.testable as boolean | undefined,
    });
  }

  static createGrammarBatch(raw: Record<string, unknown>[]): Grammar[] {
    return raw.map(r => {
      try {
        return EntityFactory.createGrammar(r);
      } catch (e) {
        Logger.warn('EntityFactory', `Skipping invalid grammar item: ${String(r.id)}`, e);
        return null;
      }
    }).filter(Boolean) as Grammar[];
  }

  static createQuiz(raw: Record<string, unknown>): Quiz {
    return new Quiz({
      id: raw.id as number | string,
      level: raw.level as CEFRLevel,
      category: (raw.category as string) ?? '',
      title: raw.title as string,
      description: (raw.description as string) ?? '',
      questions: (raw.questions as { id: number; question: string; options: string[]; correctIndex: number; explanation?: string }[]) ?? [],
    });
  }

  static createQuizBatch(raw: Record<string, unknown>[]): Quiz[] {
    return raw.map(r => {
      try {
        return EntityFactory.createQuiz(r);
      } catch (e) {
        Logger.warn('EntityFactory', `Skipping invalid quiz item: ${String(r.id)}`, e);
        return null;
      }
    }).filter(Boolean) as Quiz[];
  }

  static createSentence(raw: Record<string, unknown>): Sentence {
    return new Sentence({
      id: raw.id as number | string,
      level: raw.level as CEFRLevel,
      category: (raw.category as string) ?? '',
      german: raw.german as string,
      english: raw.english as string,
      grammarPoint: raw.grammarPoint as string | undefined,
    });
  }

  static createSentenceBatch(raw: Record<string, unknown>[]): Sentence[] {
    return raw.map(r => {
      try {
        return EntityFactory.createSentence(r);
      } catch (e) {
        Logger.warn('EntityFactory', `Skipping invalid sentence item: ${String(r.id)}`, e);
        return null;
      }
    }).filter(Boolean) as Sentence[];
  }

  static createExam(raw: Record<string, unknown>): Exam {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawSections = (raw.sections as any[]) ?? [];
    const sections = rawSections.map((s: Record<string, unknown>) => ({
      id: s.id as string,
      title: s.title as string,
      description: (s.description as string) ?? '',
      timeLimitMinutes: s.timeLimitMinutes as number,
      questions: (s.questions as Array<Record<string, unknown>> ?? []).map(q => ({
        id: q.id as number,
        type: q.type as 'multiple-choice' | 'fill-blank' | 'translation' | 'speaking',
        question: q.question as string,
        options: q.options as string[] | undefined,
        correctAnswer: q.correctAnswer as string | number,
        explanation: q.explanation as string | undefined,
        points: q.points as number,
      })),
      passingScore: s.passingScore as number,
    }));
    return new Exam({
      id: raw.id as string,
      level: raw.level as CEFRLevel,
      title: raw.title as string,
      description: (raw.description as string) ?? '',
      totalTimeMinutes: raw.totalTimeMinutes as number,
      sections,
      passingScore: raw.passingScore as number,
    });
  }
}
