export { MemoryCache } from './cache/MemoryCache';

export { BaseInMemoryRepository } from './repositories/BaseInMemoryRepository';
export { VocabularyRepository } from './repositories/VocabularyRepository';
export { GrammarRepository } from './repositories/GrammarRepository';
export { QuizRepository } from './repositories/QuizRepository';
export { SentenceRepository } from './repositories/SentenceRepository';
export { ExamRepository } from './repositories/ExamRepository';
export { CachedRepository } from './repositories/CachedRepository';

export { DataRegistry, registry } from './registry/DataRegistry';

export { Logger } from './logger/Logger';
export type { LogLevel } from './logger/Logger';

export { Sanitizer } from './security/Sanitizer';
export { SchemaValidator } from './security/SchemaValidator';
export { HtmlSanitizer } from './security/HtmlSanitizer';

export { DataLoader } from './loaders/DataLoader';
export type { LoadResult } from './loaders/DataLoader';

export { LocalStoragePersistence, progressPersistence, bookmarkPersistence, quizScorePersistence } from './persistence/LocalStoragePersistence';
export type { PersistenceEntry } from './persistence/LocalStoragePersistence';
