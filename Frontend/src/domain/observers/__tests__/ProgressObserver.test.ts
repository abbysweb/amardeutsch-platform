import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProgressObserver } from '../../observers/ProgressObserver';

describe('ProgressObserver', () => {
  let observer: ProgressObserver;

  beforeEach(() => {
    observer = ProgressObserver.getInstance();
  });

  it('is a singleton', () => {
    const a = ProgressObserver.getInstance();
    const b = ProgressObserver.getInstance();
    expect(a).toBe(b);
  });

  it('subscribes and emits events', () => {
    const listener = vi.fn();
    observer.subscribe('quiz_finished', listener);
    observer.emit({
      type: 'quiz_finished',
      level: 'A1',
      id: 1,
      score: 8,
      maxScore: 10,
      timestamp: Date.now(),
    });
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'A1', id: 1, score: 8, maxScore: 10 })
    );
  });

  it('unsubscribes listeners', () => {
    const listener = vi.fn();
    observer.subscribe('quiz_finished', listener);
    observer.unsubscribe('quiz_finished', listener);
    observer.emit({
      type: 'quiz_finished',
      level: 'A1',
      id: 99,
      timestamp: Date.now(),
    });
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple event types', () => {
    const vocabListener = vi.fn();
    const lessonListener = vi.fn();
    observer.subscribe('vocab_learned', vocabListener);
    observer.subscribe('lesson_completed', lessonListener);
    observer.emit({
      type: 'vocab_learned',
      level: 'A1',
      id: 5,
      timestamp: Date.now(),
    });
    expect(vocabListener).toHaveBeenCalled();
    expect(lessonListener).not.toHaveBeenCalled();
  });
});
