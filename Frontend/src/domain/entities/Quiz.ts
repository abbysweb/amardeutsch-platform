import { BaseEntity } from './BaseEntity';
import { ILearnable, type RenderType } from '../interfaces/ILearnable';
import type { CEFRLevel } from '../../levels/cefr';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export class Quiz extends BaseEntity implements ILearnable {
  private _title: string;
  private _description: string;
  private _questions: ReadonlyArray<QuizQuestion>;

  constructor(data: {
    id: number | string;
    level: CEFRLevel;
    category: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
  }) {
    super(data.id, data.level, data.category, 'quiz');
    this._title = data.title;
    this._description = data.description;
    this._questions = Object.freeze([...data.questions]);
  }

  getTitle(): string { return this._title; }
  getDescription(): string { return this._description; }
  getQuestions(): ReadonlyArray<QuizQuestion> { return this._questions; }
  getQuestionCount(): number { return this._questions.length; }

  getRenderType(): RenderType { return 'quiz-player'; }

  validate(): boolean {
    if (!this._title || this._title.trim().length === 0) return false;
    if (this._questions.length === 0) return false;
    return this._questions.every(q =>
      q.question.length > 0 &&
      q.options.length >= 2 &&
      q.correctIndex >= 0 &&
      q.correctIndex < q.options.length
    );
  }

  getSearchTokens(): ReadonlyArray<string> {
    return Object.freeze([
      this._title.toLowerCase(),
      this._description.toLowerCase(),
      this._category.toLowerCase(),
    ].filter(Boolean));
  }

  toDTO(): Record<string, unknown> {
    return Object.freeze({
      id: this._id,
      level: this._level,
      category: this._category,
      title: this._title,
      description: this._description,
      questions: this._questions,
      key: this._key.toString(),
    });
  }
}
