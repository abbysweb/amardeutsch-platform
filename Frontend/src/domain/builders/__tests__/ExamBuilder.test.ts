import { describe, it, expect } from 'vitest';
import { ExamBuilder } from '../../builders/ExamBuilder';

describe('ExamBuilder', () => {
  it('builds a complete exam with sections and questions', () => {
    const exam = new ExamBuilder()
      .setId('b1-final')
      .setLevel('B1')
      .setTitle('B1 Final Exam')
      .setDescription('Comprehensive B1 test')
      .setTotalTime(90)
      .setPassingScore(65)
      .addSection({
        id: 'reading',
        title: 'Reading',
        description: 'Read passages',
        timeLimitMinutes: 30,
        passingScore: 50,
        questions: [
          { id: 1, type: 'multiple-choice', question: 'Q1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', points: 10 },
        ],
      })
      .addSection({
        id: 'listening',
        title: 'Listening',
        description: 'Listen and answer',
        timeLimitMinutes: 30,
        passingScore: 50,
        questions: [
          { id: 2, type: 'multiple-choice', question: 'Q2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', points: 10 },
        ],
      })
      .build();

    expect(exam.getLevel()).toBe('B1');
    expect(exam.getTotalTimeMinutes()).toBe(90);
    expect(exam.getPassingScore()).toBe(65);
    expect(exam.getSections()).toHaveLength(2);
  });
});
