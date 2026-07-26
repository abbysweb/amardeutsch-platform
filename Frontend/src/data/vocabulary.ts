import central3NFData from './central_3nf_vocab.json';
import type { VocabularyWord as DomainVocabularyWord } from '@/domain/entities/types';
import { resolveWordVisualIcon } from '@/shared/utils/semanticIcons';
import { applyAdminOverrides } from '@/shared/utils/adminStorage';

/**
 * 3NF Relational Types
 */
export interface LevelTableItem {
  id: string;
  name: string;
  badge: string;
}

export interface CategoryTableItem {
  id: number;
  name: string;
}

export interface SentenceTableItem {
  german: string;
  english: string;
  tip?: string;
}

export interface WordTableItem {
  id: number;
  german: string;
  article: string | null;
  english: string;
  plural: string | null;
  levelId: string;
  categoryId: number;
  sentenceId: string | null;
  ipa: string | null;
  emoji: string;
}

export interface EnrichedVocabularyWord {
  id: number;
  german: string;
  article: string;
  english: string;
  plural: string;
  level: string;
  category: string;
  example: string;
  exampleEn: string;
  tip: string;
  ipa: string;
  emoji: string;
}

/**
 * Single Central 3NF JSON Source of Truth
 */
export const central3NF = central3NFData;

// In-Memory Relational Join Helper
const levelsTable = central3NFData.levels as Record<string, LevelTableItem>;
const categoriesTable = central3NFData.categories as Record<string, CategoryTableItem>;
const sentencesTable = central3NFData.sentences as Record<string, SentenceTableItem>;
const wordsTable = central3NFData.words as WordTableItem[];

/**
 * Relational join of 3NF vocabulary tables into complete, consumable vocabulary word entities.
 * Guarantees zero data duplication across multiple application calls or feature views.
 */
export const vocabulary: EnrichedVocabularyWord[] = wordsTable.map((w) => {
  const cat = categoriesTable[w.categoryId.toString()] || { name: 'General Vocabulary' };
  const sent = w.sentenceId && sentencesTable[w.sentenceId] ? sentencesTable[w.sentenceId] : { german: '', english: '', tip: '' };
  const lvl = levelsTable[w.levelId] ? w.levelId : "A1";

  return {
    id: w.id,
    german: w.german,
    article: w.article || "",
    english: w.english,
    plural: w.plural || "",
    level: lvl,
    category: cat.name,
    example: sent.german,
    exampleEn: sent.english,
    tip: sent.tip || "",
    ipa: w.ipa || "",
    emoji: resolveWordVisualIcon({ id: w.id, german: w.german, english: w.english, category: cat.name, emoji: w.emoji })
  };
});

/**
 * Retrieve all unique vocabulary words across all CEFR proficiency levels.
 */
export function getAllWords(): EnrichedVocabularyWord[] {
  return applyAdminOverrides(vocabulary);
}

/**
 * Filter vocabulary word lexicon by precise CEFR proficiency (A1, A2, B1, B2).
 */
export function getWordsByLevel(level: string): EnrichedVocabularyWord[] {
  const list = applyAdminOverrides(vocabulary);
  if (!level || level === "ALL") return list;
  const target = level.toUpperCase().trim();
  return list.filter(w => w.level === target);
}

/**
 * Fetch a randomized word from the central 3NF vocabulary lexicon.
 */
export function getRandomWord(level = "ALL"): EnrichedVocabularyWord {
  const deck = getWordsByLevel(level);
  if (deck.length === 0) return vocabulary[0] || ({} as EnrichedVocabularyWord);
  return deck[Math.floor(Math.random() * deck.length)];
}