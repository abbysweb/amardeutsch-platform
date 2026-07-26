/**
 * @file DataLoader.ts
 * Data loading pipeline: JSON → SchemaValidator → EntityFactory → Registry
 * Formalises the side-effect import pattern used by level index.ts files.
 */

import { registry } from '../registry/DataRegistry';
import { SchemaValidator } from '../security/SchemaValidator';
import { EntityFactory } from '../../domain/factories/EntityFactory';
import { Logger } from '../logger/Logger';
import type { Vocabulary } from '../../domain/entities/Vocabulary';
import type { Grammar } from '../../domain/entities/Grammar';
import type { Quiz } from '../../domain/entities/Quiz';
import type { Sentence } from '../../domain/entities/Sentence';
import type { Exam } from '../../domain/entities/Exam';

export interface LoadResult {
  vocabulary: number;
  grammar: number;
  quizzes: number;
  sentences: number;
  exam: boolean;
}

export class DataLoader {
  static loadLevel(
    level: string,
    rawVocab: unknown[],
    rawGrammar: unknown[],
    rawQuizzes: unknown[],
    rawSentences: unknown[],
    rawExam: unknown,
  ): LoadResult {
    const startMs = Date.now();
    Logger.info('DataLoader', `Loading level ${level}...`);

    const validatedVocab = SchemaValidator.validateVocabulary(rawVocab);
    const validatedGrammar = SchemaValidator.validateGrammar(rawGrammar);
    const validatedQuizzes = SchemaValidator.validateQuizzes(rawQuizzes);
    const validatedSentences = SchemaValidator.validateSentences(rawSentences);
    const validatedExam = SchemaValidator.validateExam(rawExam);

    const vocabEntities = EntityFactory.createVocabularyBatch(validatedVocab);
    const grammarEntities = EntityFactory.createGrammarBatch(validatedGrammar);
    const quizEntities = EntityFactory.createQuizBatch(validatedQuizzes);
    const sentenceEntities = EntityFactory.createSentenceBatch(validatedSentences);
    const examEntities: Exam[] = validatedExam ? [EntityFactory.createExam(validatedExam)] : [];

    registry.registerLevelRaw(
      vocabEntities,
      grammarEntities,
      quizEntities,
      sentenceEntities,
      examEntities,
    );

    const result: LoadResult = {
      vocabulary: vocabEntities.length,
      grammar: grammarEntities.length,
      quizzes: quizEntities.length,
      sentences: sentenceEntities.length,
      exam: examEntities.length > 0,
    };

    Logger.info('DataLoader', `Level ${level} loaded in ${Date.now() - startMs}ms`, result);
    return result;
  }
}
