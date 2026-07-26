import fs from 'fs';
import path from 'path';

const LEVELS = ['a1', 'a2', 'b1', 'b2'];

interface Sentence {
  id: number;
  german: string;
  english: string;
  category?: string;
}

export class SentenceMatcherService {
  private sentenceCache: Map<string, Sentence[]> = new Map();
  private allSentencesCache: Sentence[] | null = null;

  private getFrontendSentencesPath(): string {
    const monorepoRoot = path.resolve(process.cwd(), '..');
    return path.join(monorepoRoot, 'Frontend', 'src', 'levels');
  }

  private loadSentences(level: string): Sentence[] {
    if (this.sentenceCache.has(level)) {
      return this.sentenceCache.get(level)!;
    }

    try {
      const filePath = path.join(this.getFrontendSentencesPath(), level.toLowerCase(), 'sentences', 'data.json');
      if (!fs.existsSync(filePath)) {
        this.sentenceCache.set(level, []);
        return [];
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      const sentences: Sentence[] = JSON.parse(raw);
      this.sentenceCache.set(level, sentences);
      return sentences;
    } catch {
      this.sentenceCache.set(level, []);
      return [];
    }
  }

  private isCompleteSentence(text: string): boolean {
    if (!text || text.length < 10) return false;
    if (text.includes('…') || text.includes('...')) return false;
    if (text.includes('/')) return false;
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) return false;
    if (text.includes('(') || text.includes(')')) return false;
    return true;
  }

  private loadAllSentences(): Sentence[] {
    if (this.allSentencesCache) return this.allSentencesCache;
    const all: Sentence[] = [];
    for (const level of LEVELS) {
      const s = this.loadSentences(level);
      for (const sentence of s) {
        if (this.isCompleteSentence(sentence.german) && this.isCompleteSentence(sentence.english)) {
          all.push(sentence);
        }
      }
    }
    this.allSentencesCache = all;
    return all;
  }

  private extractWordStems(word: string): string[] {
    const stems: string[] = [word];
    // Common German verb endings to try
    const endings = ['en', 'n', 't', 'e', 'st', 'et', 'te', 'test', 'tet', 'ten'];
    for (const ending of endings) {
      if (word.endsWith(ending) && word.length > ending.length + 1) {
        stems.push(word.slice(0, -ending.length));
      }
    }
    return [...new Set(stems)];
  }

  private scoreMatch(candidate: Sentence, wordGerman: string, wordEnglish: string, wordCategory: string): number {
    let score = 0;
    const cGerman = candidate.german.toLowerCase();
    const cEnglish = candidate.english.toLowerCase();

    // 1. Exact word appears in the sentence (best match)
    if (wordGerman && cGerman.includes(wordGerman)) score += 10;
    if (wordEnglish && cEnglish.includes(wordEnglish)) score += 8;

    // 2. Word stem appears in the sentence
    if (wordGerman) {
      const stems = this.extractWordStems(wordGerman);
      for (const stem of stems) {
        if (stem !== wordGerman && cGerman.includes(stem)) {
          score += 5;
          break;
        }
      }
    }

    // 3. Category match
    if (wordCategory && candidate.category === wordCategory) score += 3;

    // 4. Individual word tokens match (for multi-word entries like "guten Tag")
    if (wordGerman) {
      const tokens = wordGerman.split(/\s+/).filter(t => t.length > 2);
      for (const token of tokens) {
        if (cGerman.includes(token)) score += 4;
      }
    }

    return score;
  }

  matchSentences(vocabWords: any[], level: string): any[] {
    const levelSentences = this.loadSentences(level);
    const allSentences = this.loadAllSentences();
    const usedSentenceIds = new Set<number>();

    return vocabWords.map((word: any) => {
      if (word.germanSentence || word.englishSentence) {
        return word;
      }

      const wordGerman = word.german ? word.german.toLowerCase() : '';
      const wordEnglish = word.english ? word.english.toLowerCase() : '';
      const wordCategory = word.category || '';

      // Try level-specific sentences first, then all sentences
      const candidates = [...levelSentences, ...allSentences];
      if (candidates.length === 0) return word;

      let bestSentence: Sentence | null = null;
      let bestScore = 0;

      for (const candidate of candidates) {
        if (usedSentenceIds.has(candidate.id)) continue;
        const score = this.scoreMatch(candidate, wordGerman, wordEnglish, wordCategory);
        if (score > bestScore) {
          bestScore = score;
          bestSentence = candidate;
        }
      }

      if (bestSentence && bestScore >= 4) {
        usedSentenceIds.add(bestSentence.id);
        return {
          ...word,
          germanSentence: bestSentence.german,
          englishSentence: bestSentence.english
        };
      }

      return word;
    });
  }
}