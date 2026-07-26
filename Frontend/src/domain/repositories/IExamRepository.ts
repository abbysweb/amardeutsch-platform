import type { Exam } from '../entities/Exam';
import type { CEFRLevel } from '../../levels/cefr';

export interface IExamRepository {
  getByLevel(level: CEFRLevel): Exam | undefined;
  getAll(): ReadonlyArray<Exam>;
}
