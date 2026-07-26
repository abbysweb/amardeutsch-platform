/**
 * @file LearningProgressService.ts
 * Domain service for tracking learning progress across vocabulary, grammar, and quizzes.
 * Uses the Observer pattern to react to learning events.
 */

import { ProgressObserver, type ProgressEvent, type ProgressListener } from '../observers/ProgressObserver';

export interface ProgressState {
  completedIds: Set<string>;
  scores: Map<string, { score: number; maxScore: number }>;
}

export class LearningProgressService {
  private static instance: LearningProgressService | null = null;
  private state: ProgressState = {
    completedIds: new Set(),
    scores: new Map(),
  };
  private boundHandlers: { type: ProgressEvent['type']; handler: ProgressListener }[] = [];

  private constructor() {
    const observer = ProgressObserver.getInstance();
    const handler = <T extends ProgressEvent['type']>(type: T, fn: (e: ProgressEvent & { type: T }) => void) => {
      const bound = fn.bind(this) as ProgressListener;
      this.boundHandlers.push({ type, handler: bound });
      observer.subscribe(type, bound);
    };
    handler('vocab_learned', this.onVocabLearned);
    handler('lesson_completed', this.onLessonCompleted);
    handler('quiz_finished', this.onQuizFinished);
    handler('exam_passed', this.onExamPassed);
  }

  static getInstance(): LearningProgressService {
    if (LearningProgressService.instance) {
      LearningProgressService.instance.destroy();
    }
    LearningProgressService.instance = new LearningProgressService();
    return LearningProgressService.instance;
  }

  destroy(): void {
    const observer = ProgressObserver.getInstance();
    for (const { type, handler } of this.boundHandlers) {
      observer.unsubscribe(type, handler);
    }
    this.boundHandlers = [];
  }

  private onVocabLearned(event: ProgressEvent): void {
    this.state.completedIds.add(`vocab:${event.level}:${String(event.id)}`);
  }

  private onLessonCompleted(event: ProgressEvent): void {
    this.state.completedIds.add(`grammar:${event.level}:${String(event.id)}`);
  }

  private onQuizFinished(event: ProgressEvent): void {
    this.state.completedIds.add(`quiz:${event.level}:${String(event.id)}`);
    if (event.score !== undefined && event.maxScore !== undefined) {
      this.state.scores.set(`quiz:${event.level}:${String(event.id)}`, {
        score: event.score,
        maxScore: event.maxScore,
      });
    }
  }

  private onExamPassed(event: ProgressEvent): void {
    this.state.completedIds.add(`exam:${event.level}:${String(event.id)}`);
    if (event.score !== undefined && event.maxScore !== undefined) {
      this.state.scores.set(`exam:${event.level}:${String(event.id)}`, {
        score: event.score,
        maxScore: event.maxScore,
      });
    }
  }

  isCompleted(type: 'vocab' | 'grammar' | 'quiz' | 'exam', level: string, id: number | string): boolean {
    return this.state.completedIds.has(`${type}:${level}:${String(id)}`);
  }

  getScore(type: 'quiz' | 'exam', level: string, id: number | string): { score: number; maxScore: number } | undefined {
    return this.state.scores.get(`${type}:${level}:${String(id)}`);
  }

  getCompletionCount(type: 'vocab' | 'grammar' | 'quiz' | 'exam', level?: string): number {
    let count = 0;
    for (const key of this.state.completedIds) {
      if (key.startsWith(type)) {
        if (!level || key.includes(`:${level}:`)) {
          count++;
        }
      }
    }
    return count;
  }

  getCompletionPercentage(total: number, type: 'vocab' | 'grammar' | 'quiz' | 'exam', level?: string): number {
    const completed = this.getCompletionCount(type, level);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  reset(): void {
    this.state.completedIds.clear();
    this.state.scores.clear();
  }
}
