export { BaseEntity } from './entities/BaseEntity';
export { Vocabulary } from './entities/Vocabulary';
export { Grammar } from './entities/Grammar';
export { Quiz } from './entities/Quiz';
export { Exam } from './entities/Exam';
export { Sentence } from './entities/Sentence';
export type { GrammarExample } from './entities/Grammar';
export type { QuizQuestion } from './entities/Quiz';
export type { ExamQuestion, ExamSection } from './entities/Exam';

export { CEFRLevel } from './valueObjects/CEFRLevel';
export { HybridKey, type ContentType } from './valueObjects/HybridKey';

export type { IRepository } from './repositories/IRepository';
export type { IVocabularyRepository } from './repositories/IVocabularyRepository';
export type { IGrammarRepository } from './repositories/IGrammarRepository';
export type { IQuizRepository } from './repositories/IQuizRepository';
export type { ISentenceRepository } from './repositories/ISentenceRepository';
export type { IExamRepository } from './repositories/IExamRepository';

export type { ISearchStrategy } from './strategies/ISearchStrategy';
export { VocabularySearchStrategy } from './strategies/VocabularySearchStrategy';
export { GrammarSearchStrategy } from './strategies/GrammarSearchStrategy';
export { QuizSearchStrategy } from './strategies/QuizSearchStrategy';
export { SentenceSearchStrategy } from './strategies/SentenceSearchStrategy';

export { EntityFactory } from './factories/EntityFactory';
export { ExamBuilder } from './builders/ExamBuilder';
export { ProgressObserver } from './observers/ProgressObserver';
export type { ProgressEvent, ProgressListener } from './observers/ProgressObserver';
export { LevelAccessPolicy } from './policies/LevelAccessPolicy';

export type { ILearnable } from './interfaces/ILearnable';
export type { RenderType } from './interfaces/ILearnable';

export { LevelSpecification, CategorySpecification, SearchTextSpecification } from './specifications/LevelSpecification';
export type { ISpecification } from './specifications/LevelSpecification';

export { LeafExamSection, CompositeExamSection } from './composites/ExamSection';
export type { ExamSectionComponent } from './composites/ExamSection';

export { LearningProgressService } from './services/LearningProgressService';
export { SearchService } from './services/SearchService';
export type { SearchResults } from './services/SearchService';
