import { describe, it, expect } from 'vitest';
import { LeafExamSection, CompositeExamSection } from '../../composites/ExamSection';
import type { ExamQuestion } from '../../entities/Exam';

function makeQuestion(id: number): ExamQuestion {
  return { id, type: 'multiple-choice', question: `Q ${id}?`, options: ['A', 'B'], correctAnswer: 'A', points: 10 };
}

describe('Composite Pattern — ExamSection', () => {
  it('leaf section returns its questions', () => {
    const leaf = new LeafExamSection('reading', 'Reading', 'Read passages', [makeQuestion(1), makeQuestion(2)], 20);
    expect(leaf.getQuestions()).toHaveLength(2);
    expect(leaf.getTotalPoints()).toBe(20);
    expect(leaf.getTitle()).toBe('Reading');
  });

  it('composite section aggregates child questions', () => {
    const reading = new LeafExamSection('reading', 'Reading', 'Read', [makeQuestion(1)], 15);
    const listening = new LeafExamSection('listening', 'Listening', 'Listen', [makeQuestion(2), makeQuestion(3)], 15);
    const composite = new CompositeExamSection('full', 'Full Test', 'Complete test');
    composite.add(reading);
    composite.add(listening);
    expect(composite.getTotalPoints()).toBe(30);
    expect(composite.getQuestions()).toHaveLength(3);
    expect(composite.getTitle()).toBe('Full Test');
  });
});
