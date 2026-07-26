import type { IExamRepository } from '../../domain/repositories/IExamRepository';
import { Exam } from '../../domain/entities/Exam';
import type { CEFRLevel } from '../../levels/cefr';
import { Logger } from '../logger/Logger';

export class ExamRepository implements IExamRepository {
  private readonly exams: ReadonlyMap<string, Exam>;

  constructor(exams: Exam[]) {
    const map = new Map<string, Exam>();
    for (const exam of exams) {
      map.set(exam.getLevel(), exam);
    }
    this.exams = map;
    Logger.debug('ExamRepository', `Initialised with ${exams.length} exams`);
  }

  getByLevel(level: CEFRLevel): Exam | undefined {
    return this.exams.get(level);
  }

  getAll(): ReadonlyArray<Exam> {
    return Object.freeze([...this.exams.values()]);
  }
}
