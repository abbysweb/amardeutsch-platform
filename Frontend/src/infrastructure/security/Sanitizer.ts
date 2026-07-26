/**
 * @file Sanitizer.ts
 * Security-first input sanitisation for all user-provided strings.
 * Applied before any data enters the search/filter pipeline.
 */

import { SecurityError } from '../../shared/errors/DomainError';

const MAX_SEARCH_LENGTH = 200;
const HTML_TAG_PATTERN = /<[^>]*>/g;
const INJECTION_CHARS_PATTERN = /[<>'"`;\\]/g;
const WHITESPACE_PATTERN = /\s+/g;

export class Sanitizer {
  /**
   * Sanitises a search query string.
   * - Strips HTML tags
   * - Removes injection characters
   * - Normalises whitespace
   * - Truncates to MAX_SEARCH_LENGTH
   */
  static sanitizeSearch(raw: unknown): string {
    if (typeof raw !== 'string') return '';
    return raw
      .trim()
      .slice(0, MAX_SEARCH_LENGTH)
      .replace(HTML_TAG_PATTERN, '')
      .replace(INJECTION_CHARS_PATTERN, '')
      .replace(WHITESPACE_PATTERN, ' ')
      .trim();
  }

  /**
   * Validates that a string is safe (no script injection).
   * Throws SecurityError if unsafe content detected.
   */
  static assertSafe(value: string, field: string): void {
    const dangerous = /<script|javascript:|on\w+=/i;
    if (dangerous.test(value)) {
      throw new SecurityError(`Potentially unsafe content detected in field: ${field}`);
    }
  }

  /**
   * Makes an array deeply immutable.
   * Returns a ReadonlyArray with all items frozen.
   */
  static freeze<T extends object>(arr: T[]): ReadonlyArray<T> {
    return Object.freeze(arr.map(item => Object.freeze(item))) as ReadonlyArray<T>;
  }

  /**
   * Sanitises and validates a level string.
   */
  static sanitizeLevel(raw: unknown): string {
    if (typeof raw !== 'string') return '';
    return raw.trim().toUpperCase().slice(0, 2);
  }
}
