import { BaseEntity } from './BaseEntity';
import { ILearnable, type RenderType } from '../interfaces/ILearnable';
import type { CEFRLevel } from '../../levels/cefr';

export interface GrammarExample {
  german: string;
  english: string;
}

export class Grammar extends BaseEntity implements ILearnable {
  private _title: string;
  private _description: string;
  private _content: string;
  private _examples: ReadonlyArray<GrammarExample>;
  private _conjugationTable: ReadonlyArray<string>;
  private _errorTraps: ReadonlyArray<string>;
  private _testable: boolean;

  constructor(data: {
    id: number | string;
    level: CEFRLevel;
    category: string;
    title: string;
    description: string;
    content: string;
    examples: GrammarExample[];
    conjugationTable?: string[];
    errorTraps?: string[];
    testable?: boolean;
  }) {
    super(data.id, data.level, data.category, 'grammar');
    this._title = data.title;
    this._description = data.description;
    this._content = data.content;
    this._examples = Object.freeze([...data.examples]);
    this._conjugationTable = Object.freeze([...(data.conjugationTable ?? [])]);
    this._errorTraps = Object.freeze([...(data.errorTraps ?? [])]);
    this._testable = data.testable ?? false;
  }

  getTitle(): string { return this._title; }
  getDescription(): string { return this._description; }
  getContent(): string { return this._content; }
  getExamples(): ReadonlyArray<GrammarExample> { return this._examples; }
  getConjugationTable(): ReadonlyArray<string> { return this._conjugationTable; }
  getErrorTraps(): ReadonlyArray<string> { return this._errorTraps; }
  isTestable(): boolean { return this._testable; }

  setTitle(value: string): void {
    if (!value || value.trim().length === 0) return;
    this._title = value.trim();
    this._updatedAt = new Date();
  }

  getRenderType(): RenderType { return 'lesson'; }

  validate(): boolean {
    if (!this._title || this._title.trim().length === 0) return false;
    if (!this._content || this._content.trim().length === 0) return false;
    return true;
  }

  getSearchTokens(): ReadonlyArray<string> {
    return Object.freeze([
      this._title.toLowerCase(),
      this._description.toLowerCase(),
      this._category.toLowerCase(),
      this._content.toLowerCase(),
    ].filter(Boolean));
  }

  toDTO(): Record<string, unknown> {
    return Object.freeze({
      id: this._id,
      level: this._level,
      category: this._category,
      title: this._title,
      description: this._description,
      content: this._content,
      examples: this._examples,
      conjugationTable: this._conjugationTable,
      errorTraps: this._errorTraps,
      testable: this._testable,
      key: this._key.toString(),
    });
  }
}
