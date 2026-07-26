import { BaseEntity } from './BaseEntity';
import { ILearnable, type RenderType } from '../interfaces/ILearnable';
import type { CEFRLevel } from '../../levels/cefr';

export interface ExamQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface ExamSection {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: ExamQuestion[];
  passingScore: number;
}

export class Exam extends BaseEntity implements ILearnable {
  private _title: string;
  private _description: string;
  private _totalTimeMinutes: number;
  private _sections: ReadonlyArray<ExamSection>;
  private _passingScore: number;

  constructor(data: {
    id: string;
    level: CEFRLevel;
    title: string;
    description: string;
    totalTimeMinutes: number;
    sections: ExamSection[];
    passingScore: number;
  }) {
    super(data.id, data.level, 'exam', 'exam');
    this._title = data.title;
    this._description = data.description;
    this._totalTimeMinutes = data.totalTimeMinutes;
    this._sections = Object.freeze([...data.sections]);
    this._passingScore = data.passingScore;
  }

  getTitle(): string { return this._title; }
  getDescription(): string { return this._description; }
  getTotalTimeMinutes(): number { return this._totalTimeMinutes; }
  getSections(): ReadonlyArray<ExamSection> { return this._sections; }
  getPassingScore(): number { return this._passingScore; }

  getRenderType(): RenderType { return 'exam-section'; }

  validate(): boolean {
    if (!this._title || this._title.trim().length === 0) return false;
    if (this._sections.length === 0) return false;
    return this._sections.every(s =>
      s.questions.length > 0 &&
      s.questions.every(q => q.question.length > 0 && q.points >= 0)
    );
  }

  getSearchTokens(): ReadonlyArray<string> {
    return Object.freeze([
      this._title.toLowerCase(),
      this._description.toLowerCase(),
    ].filter(Boolean));
  }

  toDTO(): Record<string, unknown> {
    return Object.freeze({
      id: this._id,
      level: this._level,
      title: this._title,
      description: this._description,
      totalTimeMinutes: this._totalTimeMinutes,
      sections: this._sections,
      passingScore: this._passingScore,
      key: this._key.toString(),
    });
  }
}
