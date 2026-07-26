import { BaseEntity } from './BaseEntity';
import { ILearnable, type RenderType } from '../interfaces/ILearnable';
import type { CEFRLevel } from '../../levels/cefr';

export class Sentence extends BaseEntity implements ILearnable {
  private _german: string;
  private _english: string;
  private _grammarPoint: string | undefined;

  constructor(data: {
    id: number | string;
    level: CEFRLevel;
    category: string;
    german: string;
    english: string;
    grammarPoint?: string;
  }) {
    super(data.id, data.level, data.category, 'sentence');
    this._german = data.german;
    this._english = data.english;
    this._grammarPoint = data.grammarPoint;
  }

  getGerman(): string { return this._german; }
  getEnglish(): string { return this._english; }
  getGrammarPoint(): string | undefined { return this._grammarPoint; }

  setGerman(value: string): void {
    if (!value || value.trim().length === 0) return;
    this._german = value.trim();
    this._updatedAt = new Date();
  }

  setEnglish(value: string): void {
    if (!value || value.trim().length === 0) return;
    this._english = value.trim();
    this._updatedAt = new Date();
  }

  getRenderType(): RenderType { return 'sentence-card'; }

  validate(): boolean {
    if (!this._german || this._german.trim().length === 0) return false;
    if (!this._english || this._english.trim().length === 0) return false;
    return true;
  }

  getSearchTokens(): ReadonlyArray<string> {
    return Object.freeze([
      this._german.toLowerCase(),
      this._english.toLowerCase(),
      this._category.toLowerCase(),
      this._grammarPoint?.toLowerCase() ?? '',
    ].filter(Boolean));
  }

  toDTO(): Record<string, unknown> {
    return Object.freeze({
      id: this._id,
      level: this._level,
      category: this._category,
      german: this._german,
      english: this._english,
      grammarPoint: this._grammarPoint,
      key: this._key.toString(),
    });
  }
}
