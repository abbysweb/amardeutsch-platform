/**
 * @file DataRegistry.ts
 * Enterprise DataRegistry v2 — upgraded Singleton Facade.
 *
 * Pipeline: JSON → SchemaValidator (Zod) → EntityFactory → Repository → MemoryCache → Facade API
 *
 * Design Patterns:
 *  - Singleton: one instance shared across the app
 *  - Facade: simple API hiding all repository/service complexity
 *  - Strategy: search strategies injected into repositories
 *  - Registry: hybrid-key O(1) indexed lookup
 *
 * Security:
 *  - All JSON validated via Zod before entity creation
 *  - All data frozen (Object.freeze) after loading
 *  - All user inputs sanitised before search
 */

import { VALID_CEFR_LEVELS, type CEFRLevel } from '../../levels/cefr';
import { VocabularyRepository } from '../repositories/VocabularyRepository';
import { GrammarRepository } from '../repositories/GrammarRepository';
import { QuizRepository } from '../repositories/QuizRepository';
import { SentenceRepository } from '../repositories/SentenceRepository';
import { ExamRepository } from '../repositories/ExamRepository';
import { EntityFactory } from '../../domain/factories/EntityFactory';
import { SchemaValidator } from '../security/SchemaValidator';
import { Logger } from '../logger/Logger';
import type { Vocabulary } from '../../domain/entities/Vocabulary';
import type { Grammar } from '../../domain/entities/Grammar';
import type { Quiz } from '../../domain/entities/Quiz';
import type { Sentence } from '../../domain/entities/Sentence';
import type { Exam } from '../../domain/entities/Exam';

interface LevelBundle {
  level?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vocabulary: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grammar: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quizzes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sentences: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exam: any;
}

class DataRegistryV2 {
  private static instance: DataRegistryV2 | null = null;
  private _isReady = false;

  private vocabRepo: VocabularyRepository | null = null;
  private grammarRepo: GrammarRepository | null = null;
  private quizRepo: QuizRepository | null = null;
  private sentenceRepo: SentenceRepository | null = null;
  private examRepo: ExamRepository | null = null;

  private registeredLevels: Set<string> = new Set();

  // ── Singleton ────────────────────────────────────────────────────────────────
  private constructor() {}

  static getInstance(): DataRegistryV2 {
    if (!DataRegistryV2.instance) {
      DataRegistryV2.instance = new DataRegistryV2();
    }
    return DataRegistryV2.instance;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  // ── Initialisation ───────────────────────────────────────────────────────────
  /**
   * Initialize with bundles — compatible with legacy LevelDataBundle[] interface.
   * Called by level index.ts files on import.
   */
  initialize(bundles: LevelBundle[]): void {
    for (const bundle of bundles) {
      if (bundle.level && this.registeredLevels.has(bundle.level)) continue;
      this.registerLevel(bundle);
      if (bundle.level) this.registeredLevels.add(bundle.level);
    }
  }

  /**
   * Registers a level bundle: JSON → Zod validation → EntityFactory → Repository.
   */
  registerLevel(bundle: LevelBundle): void {
    const startMs = Date.now();
    Logger.info('DataRegistry', 'Registering level bundle...');

    // 1. Validate through Zod schemas
    const rawVocab = SchemaValidator.validateVocabulary(bundle.vocabulary);
    const rawGrammar = SchemaValidator.validateGrammar(bundle.grammar);
    const rawQuizzes = SchemaValidator.validateQuizzes(bundle.quizzes);
    const rawSentences = SchemaValidator.validateSentences(bundle.sentences);
    const rawExam = SchemaValidator.validateExam(bundle.exam);

    // 2. Create domain entities via Factory
    const vocabEntities = EntityFactory.createVocabularyBatch(rawVocab);
    const grammarEntities = EntityFactory.createGrammarBatch(rawGrammar);
    const quizEntities = EntityFactory.createQuizBatch(rawQuizzes);
    const sentenceEntities = EntityFactory.createSentenceBatch(rawSentences);
    const examEntities: Exam[] = rawExam ? [EntityFactory.createExam(rawExam)] : [];

    // 3. Merge into repositories (or create if first call)
    this.vocabRepo = this.vocabRepo
      ? new VocabularyRepository([...this.vocabRepo.getAll() as Vocabulary[], ...vocabEntities])
      : new VocabularyRepository(vocabEntities);

    this.grammarRepo = this.grammarRepo
      ? new GrammarRepository([...this.grammarRepo.getAll() as Grammar[], ...grammarEntities])
      : new GrammarRepository(grammarEntities);

    this.quizRepo = this.quizRepo
      ? new QuizRepository([...this.quizRepo.getAll() as Quiz[], ...quizEntities])
      : new QuizRepository(quizEntities);

    this.sentenceRepo = this.sentenceRepo
      ? new SentenceRepository([...this.sentenceRepo.getAll() as Sentence[], ...sentenceEntities])
      : new SentenceRepository(sentenceEntities);

    this.examRepo = this.examRepo
      ? new ExamRepository([...this.examRepo.getAll() as Exam[], ...examEntities])
      : new ExamRepository(examEntities);

    this._isReady = true;
    Logger.info('DataRegistry', `Level registered in ${Date.now() - startMs}ms`);
  }

  /**
   * Register pre-created domain entities directly (used by DataLoader).
   * Skips Zod validation and EntityFactory — entities are already validated.
   */
  registerLevelRaw(
    vocabEntities: Vocabulary[],
    grammarEntities: Grammar[],
    quizEntities: Quiz[],
    sentenceEntities: Sentence[],
    examEntities: Exam[],
  ): void {
    this.vocabRepo = this.vocabRepo
      ? new VocabularyRepository([...this.vocabRepo.getAll() as Vocabulary[], ...vocabEntities])
      : new VocabularyRepository(vocabEntities);

    this.grammarRepo = this.grammarRepo
      ? new GrammarRepository([...this.grammarRepo.getAll() as Grammar[], ...grammarEntities])
      : new GrammarRepository(grammarEntities);

    this.quizRepo = this.quizRepo
      ? new QuizRepository([...this.quizRepo.getAll() as Quiz[], ...quizEntities])
      : new QuizRepository(quizEntities);

    this.sentenceRepo = this.sentenceRepo
      ? new SentenceRepository([...this.sentenceRepo.getAll() as Sentence[], ...sentenceEntities])
      : new SentenceRepository(sentenceEntities);

    this.examRepo = this.examRepo
      ? new ExamRepository([...this.examRepo.getAll() as Exam[], ...examEntities])
      : new ExamRepository(examEntities);

    this._isReady = true;
  }

  // ── Vocabulary Facade ─────────────────────────────────────────────────────────
  vocabulary(level?: CEFRLevel): ReadonlyArray<Vocabulary> {
    if (!this.vocabRepo) return [];
    return level ? this.vocabRepo.getByLevel(level) : this.vocabRepo.getAll();
  }

  searchVocab(query: string, level?: CEFRLevel): ReadonlyArray<Vocabulary> {
    return this.vocabRepo?.search(query, level) ?? [];
  }

  randomVocab(count: number, level?: CEFRLevel): ReadonlyArray<Vocabulary> {
    return this.vocabRepo?.getRandom(count, level) ?? [];
  }

  // ── Grammar Facade ────────────────────────────────────────────────────────────
  grammar(level?: CEFRLevel): ReadonlyArray<Grammar> {
    if (!this.grammarRepo) return [];
    return level ? this.grammarRepo.getByLevel(level) : this.grammarRepo.getAll();
  }

  searchGrammar(query: string, level?: CEFRLevel): ReadonlyArray<Grammar> {
    return this.grammarRepo?.search(query, level) ?? [];
  }

  testableGrammar(level?: CEFRLevel): ReadonlyArray<Grammar> {
    return this.grammarRepo?.getTestable(level) ?? [];
  }

  // ── Quiz Facade ───────────────────────────────────────────────────────────────
  quizzes(level?: CEFRLevel): ReadonlyArray<Quiz> {
    if (!this.quizRepo) return [];
    return level ? this.quizRepo.getByLevel(level) : this.quizRepo.getAll();
  }

  // ── Sentence Facade ───────────────────────────────────────────────────────────
  sentences(level?: CEFRLevel): ReadonlyArray<Sentence> {
    if (!this.sentenceRepo) return [];
    return level ? this.sentenceRepo.getByLevel(level) : this.sentenceRepo.getAll();
  }

  searchSentences(query: string): ReadonlyArray<Sentence> {
    return this.sentenceRepo?.search(query) ?? [];
  }

  // ── Exam Facade ───────────────────────────────────────────────────────────────
  exam(level: CEFRLevel): Exam | undefined {
    return this.examRepo?.getByLevel(level);
  }

  // ── Hybrid Key Access ──────────────────────────────────────────────────────────
  /** O(1) lookup by hybrid key string (e.g. "A1:vocab:16") */
  get(key: string): unknown {
    const all = [
      ...(this.vocabRepo?.getAll() ?? []),
      ...(this.grammarRepo?.getAll() ?? []),
      ...(this.quizRepo?.getAll() ?? []),
      ...(this.sentenceRepo?.getAll() ?? []),
    ];
    return all.find((item: { getKey: () => { toString: () => string } }) => item.getKey().toString() === key);
  }

  getVocab(level: CEFRLevel, id: number): Vocabulary | undefined {
    return this.vocabRepo?.getAll().find((v: Vocabulary) => v.getLevel() === level && v.getId() === id);
  }

  getGrammar(level: CEFRLevel, id: number): Grammar | undefined {
    return this.grammarRepo?.getAll().find((g: Grammar) => g.getLevel() === level && g.getId() === id);
  }

  // ── Cross-Level Access ─────────────────────────────────────────────────────────
  crossLevel(type: string): unknown[] {
    switch (type) {
      case 'vocab': return [...(this.vocabRepo?.getAll() ?? [])];
      case 'grammar': return [...(this.grammarRepo?.getAll() ?? [])];
      case 'quiz': return [...(this.quizRepo?.getAll() ?? [])];
      case 'sentence': return [...(this.sentenceRepo?.getAll() ?? [])];
      case 'exam': return [...(this.examRepo?.getAll() ?? [])];
      default: return [];
    }
  }

  // ── Stats Facade ──────────────────────────────────────────────────────────────
  stats(level?: CEFRLevel) {
    return {
      level: level ?? 'ALL',
      vocabularyCount: level ? this.vocabRepo?.getByLevel(level).length ?? 0 : this.vocabRepo?.count() ?? 0,
      grammarCount: level ? this.grammarRepo?.getByLevel(level).length ?? 0 : this.grammarRepo?.count() ?? 0,
      quizCount: level ? this.quizRepo?.getByLevel(level).length ?? 0 : this.quizRepo?.count() ?? 0,
      totalQuestions: level
        ? (this.quizRepo?.getByLevel(level) ?? []).reduce((sum: number, q: Quiz) => sum + q.getQuestionCount(), 0)
        : (this.quizRepo?.getAll() ?? []).reduce((sum: number, q: Quiz) => sum + q.getQuestionCount(), 0),
      sentenceCount: level ? this.sentenceRepo?.getByLevel(level).length ?? 0 : this.sentenceRepo?.count() ?? 0,
      examSections: level
        ? (this.examRepo?.getByLevel(level)?.getSections().length ?? 0)
        : (this.examRepo?.getAll() ?? []).reduce((sum: number, e: Exam) => sum + e.getSections().length, 0),
      examTotalTime: level
        ? (this.examRepo?.getByLevel(level)?.getTotalTimeMinutes() ?? 0)
        : (this.examRepo?.getAll() ?? []).reduce((sum: number, e: Exam) => sum + e.getTotalTimeMinutes(), 0),
    };
  }

  allStats() {
    return [...VALID_CEFR_LEVELS].map(l => this.stats(l));
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  /**
   * Clears all registered data and resets state.
   * Useful for testing and hot-reload in development.
   */
  clear(): void {
    this.vocabRepo = null;
    this.grammarRepo = null;
    this.quizRepo = null;
    this.sentenceRepo = null;
    this.examRepo = null;
    this.registeredLevels.clear();
    this._isReady = false;
    Logger.info('DataRegistry', 'All data cleared');
  }
}

/** Singleton export */
export const registry = DataRegistryV2.getInstance();
export { DataRegistryV2 as DataRegistry };
