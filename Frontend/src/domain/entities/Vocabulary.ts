/**
 * @file Vocabulary.ts
 * Vocabulary domain entity with full encapsulation.
 * Getters/setters enforce invariants - UI cannot corrupt data.
 */

import { BaseEntity } from './BaseEntity';
import { ILearnable, type RenderType } from '../interfaces/ILearnable';
import { ValidationError } from '../../shared/errors/DomainError';
import type { CEFRLevel } from '../../levels/cefr';

export class Vocabulary extends BaseEntity implements ILearnable {
  private _german: string;
  private _english: string;
  private _article: string | undefined;
  private _plural: string | undefined;
  private _example: string | undefined;

  constructor(data: {
    id: number | string;
    level: CEFRLevel;
    category: string;
    german: string;
    english: string;
    article?: string;
    plural?: string;
    example?: string;
  }) {
    super(data.id, data.level, data.category, 'vocab');
    this._german = data.german;
    this._english = data.english;
    this._article = data.article;
    this._plural = data.plural;
    this._example = data.example;
  }

  // -- Getters ---------------------------------------------------------------
  getGerman(): string { return this._german; }
  getEnglish(): string { return this._english; }
  getArticle(): string | undefined { return this._article; }
  getPlural(): string | undefined { return this._plural; }
  getExample(): string | undefined { return this._example; }

  /** Returns the German word without the article prefix */
  getStem(): string {
    return this._german.replace(/^(der|die|das)\s+/i, '').trim();
  }

  // -- Protected setters � validation enforced -------------------------------
  setGerman(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('German word cannot be empty', 'german');
    }
    this._german = value.trim();
    this._updatedAt = new Date();
  }

  setEnglish(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('English translation cannot be empty', 'english');
    }
    this._english = value.trim();
    this._updatedAt = new Date();
  }

  setArticle(value: string | undefined): void {
    const valid = ['der', 'die', 'das', undefined];
    if (value !== undefined && !valid.includes(value)) {
      throw new ValidationError(`Article must be der/die/das, got: ${value}`, 'article');
    }
    this._article = value;
  }

  // -- ILearnable implementation ----------------------------------------------
  getRenderType(): RenderType { return 'flashcard'; }

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
      this._article?.toLowerCase() ?? '',
      this.getStem().toLowerCase(),
    ].filter(Boolean));
  }

  toDTO(): Record<string, unknown> {
    return Object.freeze({
      id: this._id,
      level: this._level,
      category: this._category,
      german: this._german,
      english: this._english,
      article: this._article,
      plural: this._plural,
      example: this._example,
      key: this._key.toString(),
    });
  }
}
