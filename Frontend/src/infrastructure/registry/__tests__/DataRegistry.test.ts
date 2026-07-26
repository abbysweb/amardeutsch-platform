import { describe, it, expect, beforeEach } from 'vitest';
import { DataRegistry } from '../DataRegistry';

describe('DataRegistry', () => {
  let registry: DataRegistry;

  beforeEach(() => {
    registry = DataRegistry.getInstance();
    registry.clear();
  });

  it('is a singleton', () => {
    expect(DataRegistry.getInstance()).toBe(DataRegistry.getInstance());
  });

  it('initializes with level bundles', () => {
    registry.initialize([{
      level: 'A1',
      vocabulary: [{ id: 1, level: 'A1', category: 'Greetings', german: 'Hallo', english: 'Hello' }],
      grammar: [],
      quizzes: [],
      sentences: [],
      exam: { id: 'a1-exam', level: 'A1', title: 'A1 Exam', description: 'Basic test', passScore: 50, sections: [], totalTimeMinutes: 30, passingScore: 50 },
    }]);

    expect(registry.isReady).toBe(true);
    const vocab = registry.vocabulary('A1');
    expect(vocab).toHaveLength(1);
    expect(vocab[0].getGerman()).toBe('Hallo');
  });

  it('accumulates multi-level data across calls', () => {
    registry.initialize([{
      level: 'A1',
      vocabulary: [{ id: 1, level: 'A1', category: 'Greetings', german: 'Hallo', english: 'Hello' }],
      grammar: [],
      quizzes: [],
      sentences: [],
      exam: { id: 'x', level: 'A1', title: 'x', description: '', totalTimeMinutes: 0, passingScore: 0, sections: [] },
    }]);

    registry.initialize([{
      level: 'A2',
      vocabulary: [{ id: 2, level: 'A2', category: 'Work', german: 'Arbeit', english: 'Work' }],
      grammar: [],
      quizzes: [],
      sentences: [],
      exam: { id: 'y', level: 'A2', title: 'y', description: '', totalTimeMinutes: 0, passingScore: 0, sections: [] },
    }]);

    expect(registry.vocabulary('A1')).toHaveLength(1);
    expect(registry.vocabulary('A2')).toHaveLength(1);
    expect(registry.vocabulary()).toHaveLength(2);
  });

  it('returns stats for a level', () => {
    registry.initialize([{
      level: 'A1',
      vocabulary: [{ id: 1, level: 'A1', category: 'Greetings', german: 'Hallo', english: 'Hello' }],
      grammar: [],
      quizzes: [{ id: 1, level: 'A1', category: 'Test', title: 'Q', description: 'd', questions: [{ id: 1, question: '?', options: ['A', 'B'], correctIndex: 0 }] }],
      sentences: [],
      exam: { id: 'x', level: 'A1', title: 'x', description: '', totalTimeMinutes: 0, passingScore: 0, sections: [] },
    }]);

    const s = registry.stats('A1');
    expect(s.vocabularyCount).toBe(1);
    expect(s.quizCount).toBe(1);
    expect(s.totalQuestions).toBe(1);
  });

  it('returns empty array before initialization', () => {
    expect(registry.vocabulary('A1')).toEqual([]);
  });
});
