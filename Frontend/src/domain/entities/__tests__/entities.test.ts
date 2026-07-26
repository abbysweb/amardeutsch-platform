import { describe, it, expect } from 'vitest';
import { Vocabulary } from '../Vocabulary';
import { Grammar } from '../Grammar';
import { Quiz } from '../Quiz';
import { Sentence } from '../Sentence';
import { Exam } from '../Exam';

describe('Vocabulary', () => {
  const vocab = new Vocabulary({
    id: 1,
    level: 'A1',
    category: 'Greetings',
    german: 'Hallo',
    english: 'Hello',
    article: undefined,
  });

  it('creates and returns correct properties', () => {
    expect(vocab.getId()).toBe(1);
    expect(vocab.getLevel()).toBe('A1');
    expect(vocab.getGerman()).toBe('Hallo');
    expect(vocab.getEnglish()).toBe('Hello');
    expect(vocab.getStem()).toBe('Hallo');
    expect(vocab.getCategory()).toBe('Greetings');
  });

  it('returns hybrid key with correct format', () => {
    expect(vocab.getKey().toString()).toBe('A1:vocab:1');
  });

  it('generates search tokens', () => {
    const tokens = vocab.getSearchTokens();
    expect(tokens).toContain('hallo');
    expect(tokens).toContain('hello');
    expect(tokens).toContain('greetings');
  });

  it('converts to DTO', () => {
    const dto = vocab.toDTO();
    expect(dto.german).toBe('Hallo');
    expect(dto.level).toBe('A1');
  });
});

describe('Grammar', () => {
  it('creates grammar entity with examples', () => {
    const g = new Grammar({
      id: 1,
      level: 'A1',
      category: 'Articles',
      title: 'Definite Articles',
      description: 'Der, Die, Das usage',
      content: '<p>German articles</p>',
      examples: [{ german: 'Der Mann', english: 'The man' }],
      testable: true,
    });
    expect(g.getTitle()).toBe('Definite Articles');
    expect(g.isTestable()).toBe(true);
    expect(g.getSearchTokens()).toContain('definite articles');
    expect(g.getSearchTokens()).toContain('articles');
  });
});

describe('Quiz', () => {
  const quiz = new Quiz({
    id: 1,
    level: 'A1',
    category: 'Greetings',
    title: 'Basic Greetings',
    description: 'Test your greeting vocabulary',
    questions: [
      { id: 1, question: 'How do you say Hello?', options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'], correctIndex: 0 },
      { id: 2, question: 'What does "Danke" mean?', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correctIndex: 2 },
    ],
  });

  it('returns question count', () => {
    expect(quiz.getQuestionCount()).toBe(2);
  });

  it('returns questions frozen', () => {
    expect(Object.isFrozen(quiz.getQuestions())).toBe(true);
  });
});

describe('Sentence', () => {
  it('creates sentence with search tokens', () => {
    const s = new Sentence({
      id: 1,
      level: 'A1',
      category: 'General',
      german: 'Ich heiße Anna',
      english: 'My name is Anna',
    });
    expect(s.getSearchTokens()).toContain('ich heiße anna');
    expect(s.getSearchTokens()).toContain('my name is anna');
    expect(s.toDTO().german).toBe('Ich heiße Anna');
  });
});

describe('Exam', () => {
  const exam = new Exam({
    id: 'exam-b1-1',
    level: 'B1',
    title: 'B1 Practice Exam',
    description: 'Full B1 level test',
    totalTimeMinutes: 60,
    passingScore: 60,
    sections: [
      {
        id: 'reading',
        title: 'Reading Comprehension',
        description: 'Read and answer',
        timeLimitMinutes: 20,
        passingScore: 60,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the main idea?',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 'A',
            points: 10,
          },
        ],
      },
    ],
  });

  it('returns exam properties', () => {
    expect(exam.getLevel()).toBe('B1');
    expect(exam.getTotalTimeMinutes()).toBe(60);
    expect(exam.getSections()).toHaveLength(1);
    expect(exam.getPassingScore()).toBe(60);
  });

  it('returns sections as frozen array', () => {
    expect(Object.isFrozen(exam.getSections())).toBe(true);
  });
});
