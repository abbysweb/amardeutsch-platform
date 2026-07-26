/**
 * @fileoverview
 * Next.js API Route for batch generating example sentences.
 * This script iterates over all vocabulary words in the SQLite database and assigns them
 * an example sentence. It first attempts to find a real, natural sentence from the local
 * JSON files (originally from Tatoeba). If no suitable match is found, it generates a fallback
 * template sentence using grammar rules based on the word's article or verb status.
 */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const LEVELS = ['a1', 'a2', 'b1', 'b2'];

interface SentenceData {
  id: number;
  german: string;
  english: string;
  category?: string;
}

/**
 * Resolves the absolute path to the local sentence data JSON files.
 * @returns The absolute path to the `Frontend/src/levels` directory.
 */
function getSentencesPath(): string {
  return path.resolve(process.cwd(), '..', 'Frontend', 'src', 'levels');
}

/**
 * Validates whether a given string is a complete, well-formed sentence suitable for flashcards.
 * Rejects sentences that are too short, contain ellipses, parentheses, or lack terminal punctuation.
 * 
 * @param text - The sentence candidate to evaluate.
 * @returns True if the sentence is well-formed; otherwise false.
 */
function isCompleteSentence(text: string): boolean {
  if (!text || text.length < 10) return false;
  if (text.includes('…') || text.includes('...')) return false;
  if (text.includes('/')) return false;
  if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) return false;
  if (text.includes('(') || text.includes(')')) return false;
  if (text.startsWith('-') || text.startsWith(',')) return false;
  return true;
}

/**
 * Iterates through all CEFR level folders (a1, a2, b1, b2) to load, parse, and validate
 * the local JSON sentence banks.
 * 
 * @returns A flattened array of all valid `SentenceData` objects across all levels.
 */
function loadAllSentences(): SentenceData[] {
  const all: SentenceData[] = [];
  for (const level of LEVELS) {
    try {
      const filePath = path.join(getSentencesPath(), level, 'sentences', 'data.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const sentences: SentenceData[] = JSON.parse(raw);
        for (const s of sentences) {
          if (!isCompleteSentence(s.german) || !isCompleteSentence(s.english)) continue;
          all.push(s);
        }
      }
    } catch { /* skip */ }
  }
  return all;
}

/**
 * Extracts potential morphological stems from a given German word.
 * This allows the sentence matcher to find verbs or nouns in their conjugated/declined forms.
 * 
 * @param word - The base word (usually nominative or infinitive).
 * @returns An array of unique stem strings.
 */
function extractStems(word: string): string[] {
  const stems = [word];
  const endings = ['en', 'n', 't', 'e', 'st', 'et', 'te', 'test', 'tet', 'ten'];
  for (const ending of endings) {
    if (word.endsWith(ending) && word.length > ending.length + 1) {
      stems.push(word.slice(0, -ending.length));
    }
  }
  return [...new Set(stems)];
}

/**
 * Scores and finds the most relevant example sentence for a given vocabulary word.
 * It prioritizes exact German matches, then English matches, then morphological stems.
 * 
 * @param wordGerman - The target German word.
 * @param wordEnglish - The target English translation.
 * @param wordCategory - The category of the word (optional).
 * @param sentences - The array of available sentences to search through.
 * @param usedIds - A tracking set of sentence IDs that have already been assigned to prevent repetition.
 * @returns The highest scoring `SentenceData` object (if the score >= 4), or null if no good match is found.
 */
function findBestSentence(
  wordGerman: string,
  wordEnglish: string,
  wordCategory: string,
  sentences: SentenceData[],
  usedIds: Set<number>
): SentenceData | null {
  const wG = wordGerman.toLowerCase();
  const wE = wordEnglish.toLowerCase();
  let best: SentenceData | null = null;
  let bestScore = 0;

  for (const s of sentences) {
    if (usedIds.has(s.id)) continue;
    const cG = s.german.toLowerCase();
    const cE = s.english.toLowerCase();
    let score = 0;

    if (wG && cG.includes(wG)) score += 10;
    if (wE && cE.includes(wE)) score += 8;

    if (wG) {
      for (const stem of extractStems(wG)) {
        if (stem !== wG && cG.includes(stem)) { score += 5; break; }
      }
    }

    if (wordCategory && s.category === wordCategory) score += 3;

    if (wG) {
      wG.split(/\s+/).filter(t => t.length > 2).forEach(t => { if (cG.includes(t)) score += 4; });
    }

    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }

  return bestScore >= 4 ? best : null;
}

/**
 * Returns the accusative case form of a given German definite article.
 * 
 * @param article - The nominative definite article ('der', 'die', 'das').
 * @returns The accusative definite article.
 */
function accusative(article: string): string {
  if (article.toLowerCase() === 'der') return 'den';
  return article.toLowerCase();
}

/**
 * Generates a fallback, template-based sentence for a word when no natural sentence is found.
 * Adapts the grammar based on whether the word is a noun (requires articles and case declension)
 * or a verb.
 * 
 * @param german - The German word.
 * @param english - The English word.
 * @param article - The German article (if it's a noun).
 * @returns An object containing the generated German and English sentences.
 */
function generateTemplateSentence(german: string, english: string, article: string | null): { german: string; english: string } {
  const capGerman = german.charAt(0).toUpperCase() + german.slice(1);
  const capEnglish = english.charAt(0).toUpperCase() + english.slice(1);
  const a = article?.toLowerCase() || '';
  const akk = accusative(a);

  const hasArticle = ['der', 'die', 'das'].includes(a);
  const isVerb = !hasArticle && german.endsWith('en');

  const nounPatterns: { de: (a: string, akk: string, w: string) => string; en: (w: string) => string }[] = [
    { de: (a, _a, w) => `Das ist ${a} ${w}.`, en: (w) => `This is the ${w}.` },
    { de: (_a, akk, w) => `Ich sehe ${akk} ${w}.`, en: (w) => `I see the ${w}.` },
    { de: (a, _a, w) => `Hier ist ${a} ${w}.`, en: (w) => `Here is the ${w}.` },
    { de: (_a, akk, w) => `Ich mag ${akk} ${w}.`, en: (w) => `I like the ${w}.` },
    { de: (_a, akk, w) => `Kannst du ${akk} ${w} sehen?`, en: (w) => `Can you see the ${w}?` },
    { de: (a, _a, w) => `${a.charAt(0).toUpperCase() + a.slice(1)} ${w} ist praktisch.`, en: (w) => `The ${w} is practical.` },
  ];

  const genericPatterns: { de: (w: string) => string; en: (w: string) => string }[] = [
    { de: (w) => `${w} ist wichtig.`, en: (w) => `${w} is important.` },
    { de: (w) => `Heute lerne ich: ${w}.`, en: (w) => `Today I learn: ${w}.` },
    { de: (w) => `${w} gefällt mir.`, en: (w) => `I like ${w}.` },
    { de: (w) => `Jeder kennt ${w}.`, en: (w) => `Everyone knows ${w}.` },
    { de: (w) => `Ich denke an ${w}.`, en: (w) => `I think about ${w}.` },
  ];

  if (hasArticle) {
    const idx = Math.floor(Math.random() * nounPatterns.length);
    const pattern = nounPatterns[idx];
    return {
      german: pattern.de(a, akk, german),
      english: pattern.en(capEnglish)
    };
  }

  if (isVerb) {
    const verbPatterns: { de: (w: string) => string; en: (w: string) => string }[] = [
      { de: (w) => `${w} ist eine wichtige Tätigkeit.`, en: (w) => `${w} is an important activity.` },
      { de: (w) => `Heute lerne ich: ${w}.`, en: (w) => `Today I learn: ${w}.` },
      { de: (w) => `Ich möchte ${w.toLowerCase()} lernen.`, en: (w) => `I want to learn ${w.toLowerCase()}.` },
      { de: (w) => `${w} kann jeder lernen.`, en: (w) => `Anyone can learn ${w.toLowerCase()}.` },
    ];
    const idx = Math.floor(Math.random() * verbPatterns.length);
    const pattern = verbPatterns[idx];
    return {
      german: pattern.de(capGerman),
      english: pattern.en(capEnglish)
    };
  }

  const idx = Math.floor(Math.random() * genericPatterns.length);
  const pattern = genericPatterns[idx];
  return {
    german: pattern.de(capGerman),
    english: pattern.en(capEnglish)
  };
}

/**
 * The main API route handler for `POST /api/admin/vocab/generate-sentences`.
 * 
 * Flow:
 * 1. Loads all available sentences from local JSON banks.
 * 2. Fetches all vocabulary words from the SQLite database, sorted by level and ID.
 * 3. Skips words that already have sentences assigned.
 * 4. For words without sentences, attempts to find the best match or generates a fallback template.
 * 5. Updates the database with the new sentences.
 * 
 * @returns A JSON response summarizing the total processed, updated, and skipped records.
 */
export async function POST() {
  try {
    const sentences = loadAllSentences();
    const usedIds = new Set<number>();
    const allWords = await prisma.vocabulary.findMany({ orderBy: [{ levelId: 'asc' }, { id: 'asc' }] });

    let updated = 0;
    let skipped = 0;

    for (const word of allWords) {
      if (word.germanSentence || word.englishSentence) {
        skipped++;
        continue;
      }

      const matched = findBestSentence(
        word.german, word.english || '',
        '', // category not stored directly on vocab table
        sentences,
        usedIds
      );

      let germanSentence: string;
      let englishSentence: string;

      if (matched) {
        usedIds.add(matched.id);
        germanSentence = matched.german;
        englishSentence = matched.english;
      } else {
        const generated = generateTemplateSentence(word.german, word.english || '', word.article);
        germanSentence = generated.german;
        englishSentence = generated.english;
      }

      await prisma.vocabulary.update({
        where: { id: word.id },
        data: { germanSentence, englishSentence }
      });

      updated++;
    }

    return NextResponse.json({
      success: true,
      total: allWords.length,
      updated,
      skipped,
      message: `Generated sentences for ${updated} words. ${skipped} already had sentences.`
    });

  } catch (error: any) {
    console.error("Generate Sentences Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
