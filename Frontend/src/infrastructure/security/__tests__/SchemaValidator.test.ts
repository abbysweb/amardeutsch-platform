import { describe, it, expect } from 'vitest';
import { SchemaValidator } from '../SchemaValidator';

describe('SchemaValidator', () => {
  describe('vocabulary', () => {
    it('validates correct vocabulary array', () => {
      const data = [
        { id: 1, level: 'A1', category: 'Greetings', german: 'Hallo', english: 'Hello' },
      ];
      const result = SchemaValidator.validateVocabulary(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ german: 'Hallo' });
    });

    it('filters out invalid items gracefully', () => {
      const result = SchemaValidator.validateVocabulary([{ bad: 'data' }]);
      expect(result).toHaveLength(0);
    });
  });

  describe('grammar', () => {
    it('validates grammar with required fields', () => {
      const data = [
        { id: 1, level: 'A1', category: 'Grammar', title: 'Articles', description: 'desc', content: 'content', examples: [], testable: true },
      ];
      const result = SchemaValidator.validateGrammar(data);
      expect(result).toHaveLength(1);
    });
  });

  describe('quizzes', () => {
    it('validates quiz with questions', () => {
      const data = [
        { id: 1, level: 'A1', category: 'Test', title: 'Quiz 1', description: 'desc', questions: [{ id: 1, question: '?', options: ['A', 'B'], correctIndex: 0 }] },
      ];
      const result = SchemaValidator.validateQuizzes(data);
      expect(result).toHaveLength(1);
    });
  });

  describe('sentences', () => {
    it('validates sentence array', () => {
      const data = [{ id: 1, level: 'A1', category: 'General', german: 'Ich bin', english: 'I am' }];
      const result = SchemaValidator.validateSentences(data);
      expect(result).toHaveLength(1);
    });
  });

  describe('exam', () => {
    it('validates exam object', () => {
      const data = { id: 'e1', level: 'A1', title: 'Exam', description: 'desc', totalTimeMinutes: 30, passingScore: 50, sections: [] };
      const result = SchemaValidator.validateExam(data);
      expect(result).toMatchObject({ title: 'Exam' });
    });
  });
});
