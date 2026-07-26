import { Logger } from '../../infrastructure/logger/Logger';
import { logUserActivity } from '../../shared/components/Analytics/InterconnectedAnalyticsDashboard';

export interface ProgressEvent {
  type: 'quiz_finished' | 'lesson_completed' | 'vocab_learned' | 'exam_passed';
  level: string;
  id: number | string;
  score?: number;
  maxScore?: number;
  timestamp: number;
}

export type ProgressListener = (event: ProgressEvent) => void;

export class ProgressObserver {
  private static instance: ProgressObserver | null = null;
  private listeners: Map<string, Set<ProgressListener>> = new Map();

  private constructor() {}

  static getInstance(): ProgressObserver {
    if (!ProgressObserver.instance) {
      ProgressObserver.instance = new ProgressObserver();
    }
    return ProgressObserver.instance;
  }

  subscribe(eventType: ProgressEvent['type'], listener: ProgressListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
    Logger.debug('ProgressObserver', `Listener subscribed to ${eventType}`);
  }

  unsubscribe(eventType: ProgressEvent['type'], listener: ProgressListener): void {
    this.listeners.get(eventType)?.delete(listener);
  }

  emit(event: ProgressEvent): void {
    Logger.debug('ProgressObserver', `Event: ${event.type} for ${event.level}:${event.id}`);
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => {
        try {
          listener(event);
        } catch (e) {
          Logger.error('ProgressObserver', `Listener error for ${event.type}`, e);
        }
      });
    }
  }

  /** Convenience: emit quiz finished and store in localStorage */
  static onQuizFinished(level: string, quizId: number | string, score: number, maxScore: number): void {
    const event: ProgressEvent = {
      type: 'quiz_finished',
      level,
      id: quizId,
      score,
      maxScore,
      timestamp: Date.now(),
    };
    ProgressObserver.getInstance().emit(event);
    if (typeof window !== 'undefined') {
      const key = `quiz-score:${level}:${quizId}`;
      localStorage.setItem(key, JSON.stringify({ score, maxScore, timestamp: event.timestamp }));
      logUserActivity({
        type: 'quiz',
        title: `Completed Quiz #${quizId} (${level.toUpperCase()})`,
        points: score * 5,
        level: (level.toUpperCase() as any) || 'ALL',
        details: `Score: ${score} / ${maxScore}`,
      });
    }
  }

  /** Convenience: mark vocabulary as learned */
  static onVocabLearned(level: string, wordId: number | string): void {
    const event: ProgressEvent = {
      type: 'vocab_learned',
      level,
      id: wordId,
      timestamp: Date.now(),
    };
    ProgressObserver.getInstance().emit(event);
    if (typeof window !== 'undefined') {
      logUserActivity({
        type: 'vocab',
        title: `Mastered Vocabulary Card #${wordId} (${level.toUpperCase()})`,
        points: 10,
        level: (level.toUpperCase() as any) || 'ALL',
        details: 'Marked as completed vocabulary word.',
      });
    }
  }

  /** Convenience: mark exam as passed with score */
  static onExamPassed(level: string, examId: number | string, score: number, maxScore: number): void {
    const event: ProgressEvent = {
      type: 'exam_passed',
      level,
      id: examId,
      score,
      maxScore,
      timestamp: Date.now(),
    };
    ProgressObserver.getInstance().emit(event);
    if (typeof window !== 'undefined') {
      const key = `exam-score:${level}:${examId}`;
      localStorage.setItem(key, JSON.stringify({ score, maxScore, timestamp: event.timestamp }));
      logUserActivity({
        type: 'quiz',
        title: `Passed Exam #${examId} (${level.toUpperCase()})`,
        points: score * 10,
        level: (level.toUpperCase() as any) || 'ALL',
        details: `Final Score: ${score} / ${maxScore}`,
      });
    }
  }
}
