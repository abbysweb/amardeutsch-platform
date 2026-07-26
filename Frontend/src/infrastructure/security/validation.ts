import type { CEFRLevel } from '../../levels/cefr';
import type {
  BaseEntity,
  VocabularyWord,
  GrammarLesson,
  Quiz,
  QuizQuestion,
  SentencePair,
  Exam,
  ExamSection,
  ExamQuestion,
  HybridKeyStr,
  ContentType,
} from '../../domain/entities/types';
import { VALID_LEVELS_SET } from '../../levels/config';

const VALID_LEVELS = VALID_LEVELS_SET;
const MAX_SEARCH_LENGTH = 200;
const MAX_ID = 999_999;

export function sanitizeSearchInput(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .slice(0, MAX_SEARCH_LENGTH)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"`;]/g, '')
    .replace(/\s+/g, ' ');
}

export function validateLevel(level: unknown): CEFRLevel {
  if (typeof level !== 'string' || !VALID_LEVELS.has(level as CEFRLevel)) {
    throw new RangeError(`Invalid CEFR level: "${level}". Must be one of: ${[...VALID_LEVELS].join(', ')}`);
  }
  return level as CEFRLevel;
}

export function validateId(id: unknown): number {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > MAX_ID) {
    throw new RangeError(`Invalid entity ID: "${id}". Must be a positive integer ≤ ${MAX_ID}`);
  }
  return n;
}

export function validateHybridKey(key: unknown): HybridKeyStr {
  if (typeof key !== 'string') throw new TypeError('Hybrid key must be a string');
  const parts = key.split(':');
  if (parts.length !== 3) throw new RangeError(`Invalid hybrid key format: "${key}"`);
  validateLevel(parts[0]);
  validateContentType(parts[1]);
  validateId(parts[2]);
  return key as HybridKeyStr;
}

const VALID_TYPES = new Set<ContentType>(['vocab', 'grammar', 'quiz', 'sentence', 'exam']);

export function validateContentType(type: unknown): ContentType {
  if (typeof type !== 'string' || !VALID_TYPES.has(type as ContentType)) {
    throw new RangeError(`Invalid content type: "${type}"`);
  }
  return type as ContentType;
}

function hasStringProp(obj: unknown, key: string): boolean {
  return typeof obj === 'object' && obj !== null && key in obj && typeof (obj as Record<string, unknown>)[key] === 'string';
}

function hasNumberProp(obj: unknown, key: string): boolean {
  return typeof obj === 'object' && obj !== null && key in obj && typeof (obj as Record<string, unknown>)[key] === 'number';
}

function hasArrayProp(obj: unknown, key: string): boolean {
  return typeof obj === 'object' && obj !== null && key in obj && Array.isArray((obj as Record<string, unknown>)[key]);
}

export function isVocabularyWord(obj: unknown): obj is VocabularyWord {
  return hasStringProp(obj, 'german') && hasStringProp(obj, 'english') && hasNumberProp(obj, 'id');
}

export function isGrammarLesson(obj: unknown): obj is GrammarLesson {
  return hasStringProp(obj, 'title') && hasStringProp(obj, 'content') && hasArrayProp(obj, 'examples');
}

export function isQuiz(obj: unknown): obj is Quiz {
  return hasStringProp(obj, 'title') && hasArrayProp(obj, 'questions');
}

export function isSentencePair(obj: unknown): obj is SentencePair {
  return hasStringProp(obj, 'german') && hasStringProp(obj, 'english') && hasNumberProp(obj, 'id');
}

export function isExam(obj: unknown): obj is Exam {
  return hasStringProp(obj, 'title') && hasArrayProp(obj, 'sections');
}

function assertArray<T>(arr: unknown, guard: (item: unknown) => item is T): T[] {
  if (!Array.isArray(arr)) throw new TypeError('Expected an array');
  for (const item of arr) {
    if (!guard(item)) throw new TypeError(`Invalid item in array: ${JSON.stringify(item).slice(0, 100)}`);
  }
  return arr;
}

export function assertVocabularyArray(arr: unknown): VocabularyWord[] {
  return assertArray(arr, isVocabularyWord);
}

export function assertGrammarArray(arr: unknown): GrammarLesson[] {
  return assertArray(arr, isGrammarLesson);
}

export function assertQuizArray(arr: unknown): Quiz[] {
  return assertArray(arr, isQuiz);
}

export function assertSentenceArray(arr: unknown): SentencePair[] {
  return assertArray(arr, isSentencePair);
}

export function assertExam(obj: unknown): Exam {
  if (!isExam(obj)) throw new TypeError('Invalid exam object');
  return obj;
}
