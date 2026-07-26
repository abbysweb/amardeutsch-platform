/**
 * @file CEFRLevel.ts
 * Value Object for CEFR proficiency levels.
 * Immutable, validated, compared by value (not reference).
 */

import { VALID_CEFR_LEVELS, type CEFRLevel as CEFRLevelType, LEVEL_META } from '../../levels/cefr';
import { InvalidLevelError } from '../../shared/errors/DomainError';

export class CEFRLevel {
  private readonly _value: CEFRLevelType;

  private constructor(value: CEFRLevelType) {
    this._value = value;
    Object.freeze(this);
  }

  /** Factory method - validates and creates a CEFRLevel value object */
  static fromString(raw: unknown): CEFRLevel {
    if (typeof raw !== 'string' || !VALID_CEFR_LEVELS.includes(raw as CEFRLevelType)) {
      throw new InvalidLevelError(raw);
    }
    return new CEFRLevel(raw as CEFRLevelType);
  }

  /** Returns the string primitive value */
  getValue(): CEFRLevelType {
    return this._value;
  }

  /** Returns the human-readable label */
  getLabel(): string {
    return LEVEL_META[this._value].label;
  }

  /** Returns the numeric order (A1=1, A2=2, B1=3, B2=4) */
  getOrder(): number {
    return LEVEL_META[this._value].order;
  }

  /** Value object equality � compares by value, not reference */
  equals(other: CEFRLevel): boolean {
    return this._value === other._value;
  }

  /** Returns true if this level is higher than the given level */
  isHigherThan(other: CEFRLevel): boolean {
    return this.getOrder() > other.getOrder();
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }
}
