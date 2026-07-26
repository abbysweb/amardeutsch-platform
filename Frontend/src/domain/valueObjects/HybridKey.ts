/**
 * @file HybridKey.ts
 * Value Object for globally unique composite keys.
 * Format: "{LEVEL}:{TYPE}:{ID}" e.g. "A1:vocab:16"
 * Immutable, parsed, compared by value.
 */

import { ValidationError } from '../../shared/errors/DomainError';

export type ContentType = 'vocab' | 'grammar' | 'quiz' | 'sentence' | 'exam';

const VALID_CONTENT_TYPES: ReadonlySet<string> = new Set<ContentType>([
  'vocab', 'grammar', 'quiz', 'sentence', 'exam',
]);

export class HybridKey {
  private readonly _level: string;
  private readonly _type: ContentType;
  private readonly _id: string;
  private readonly _raw: string;

  private constructor(level: string, type: ContentType, id: string | number) {
    this._level = level;
    this._type = type;
    this._id = String(id);
    this._raw = `${level}:${type}:${this._id}`;
    Object.freeze(this);
  }

  /** Create from components */
  static create(level: string, type: ContentType, id: string | number): HybridKey {
    if (!level) throw new ValidationError('HybridKey level cannot be empty');
    if (!VALID_CONTENT_TYPES.has(type)) throw new ValidationError(`Invalid content type: ${type}`);
    return new HybridKey(level, type, id);
  }

  /** Parse from string "A1:vocab:16" */
  static parse(raw: string): HybridKey {
    const parts = raw.split(':');
    if (parts.length !== 3) {
      throw new ValidationError(`Invalid HybridKey format: "${raw}". Expected "LEVEL:TYPE:ID"`);
    }
    const [level, type, id] = parts as [string, string, string];
    if (!VALID_CONTENT_TYPES.has(type)) {
      throw new ValidationError(`Invalid content type in key: ${type}`);
    }
    return new HybridKey(level, type as ContentType, id);
  }

  getLevel(): string { return this._level; }
  getType(): ContentType { return this._type; }
  getId(): string { return this._id; }
  getRaw(): string { return this._raw; }

  equals(other: HybridKey): boolean {
    return this._raw === other._raw;
  }

  toString(): string { return this._raw; }
  toJSON(): string { return this._raw; }
}
