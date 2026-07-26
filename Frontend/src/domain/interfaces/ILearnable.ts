/**
 * @file ILearnable.ts
 * Core polymorphism interface.
 * Every domain entity that can be learned implements this.
 * UI layer calls content.render() - no if/switch needed.
 */

import type { CEFRLevel as CEFRLevelType } from '../../levels/cefr';

export type RenderType = 'flashcard' | 'lesson' | 'quiz-player' | 'sentence-card' | 'exam-section';

export interface ILearnable {
  /** Returns how this entity should be rendered by the UI */
  getRenderType(): RenderType;

  /** Validates the entity's data integrity */
  validate(): boolean;

  /** Returns searchable text tokens for this entity */
  getSearchTokens(): ReadonlyArray<string>;

  /** Returns the entity's CEFR level */
  getLevel(): CEFRLevelType;

  /** Returns the content category */
  getCategory(): string;

  /** Serialize to a plain data transfer object (safe for UI) */
  toDTO(): Record<string, unknown>;
}
