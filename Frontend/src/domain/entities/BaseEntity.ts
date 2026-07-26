/**
 * @file BaseEntity.ts
 * Abstract base class - root of the entire entity inheritance hierarchy.
 *
 * Key OOP features:
 * - protected fields (encapsulation - subclasses can read, outside cannot write)
 * - abstract validate() (polymorphism - every entity validates differently)
 * - timestamps (auditing)
 * - Object.freeze protection on construction
 */

import type { CEFRLevel } from '../../levels/cefr';
import { HybridKey, type ContentType } from '../valueObjects/HybridKey';

export abstract class BaseEntity {
  protected readonly _id: number | string;
  protected _level: CEFRLevel;
  protected _category: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected readonly _key: HybridKey;

  constructor(
    id: number | string,
    level: CEFRLevel,
    category: string,
    contentType: ContentType,
  ) {
    this._id = id;
    this._level = level;
    this._category = category;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._key = HybridKey.create(level, contentType, id);
  }

  // -- Getters (public read, no public setter � encapsulation) --------------

  getId(): number | string { return this._id; }
  getLevel(): CEFRLevel { return this._level; }
  getCategory(): string { return this._category; }
  getCreatedAt(): Date { return this._createdAt; }
  getUpdatedAt(): Date { return this._updatedAt; }
  getKey(): HybridKey { return this._key; }

  // -- Protected setters (only subclasses and internal methods can mutate) --

  protected setCategory(value: string): void {
    if (!value || value.trim().length === 0) return;
    this._category = value.trim();
    this._updatedAt = new Date();
  }

  // -- Abstract contract � every subclass must implement --------------------

  /** Validates all required fields. Throws ValidationError if invalid. */
  abstract validate(): boolean;

  /** Returns a plain object safe for UI consumption */
  abstract toDTO(): Record<string, unknown>;

  // -- Utility --------------------------------------------------------------

  equals(other: BaseEntity): boolean {
    return this._key.equals(other._key);
  }

  toString(): string {
    return `[${this.constructor.name}] ${this._key.toString()}`;
  }
}
