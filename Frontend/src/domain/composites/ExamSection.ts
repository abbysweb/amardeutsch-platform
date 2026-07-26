/**
 * Composite Pattern — ExamSection tree structure.
 * Sections can contain sub-sections, forming a tree.
 * Both leaf and composite sections share the same interface.
 */

import type { ExamQuestion } from '../entities/Exam';

export interface ExamSectionComponent {
  getId(): string;
  getTitle(): string;
  getDescription(): string;
  getQuestions(): ExamQuestion[];
  getTotalPoints(): number;
  getTimeLimitMinutes(): number;
  isComposite(): boolean;
}

export class LeafExamSection implements ExamSectionComponent {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly questions: ExamQuestion[],
    private readonly timeLimitMinutes: number,
  ) {}

  getId(): string { return this.id; }
  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  getQuestions(): ExamQuestion[] { return [...this.questions]; }
  getTimeLimitMinutes(): number { return this.timeLimitMinutes; }
  isComposite(): boolean { return false; }

  getTotalPoints(): number {
    return this.questions.reduce((sum, q) => sum + q.points, 0);
  }
}

export class CompositeExamSection implements ExamSectionComponent {
  private readonly children: ExamSectionComponent[] = [];

  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
  ) {}

  getId(): string { return this.id; }
  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  isComposite(): boolean { return true; }

  add(child: ExamSectionComponent): void {
    this.children.push(child);
  }

  remove(child: ExamSectionComponent): void {
    const idx = this.children.indexOf(child);
    if (idx >= 0) this.children.splice(idx, 1);
  }

  getChildren(): ReadonlyArray<ExamSectionComponent> {
    return Object.freeze([...this.children]);
  }

  getQuestions(): ExamQuestion[] {
    return this.children.flatMap(c => c.getQuestions());
  }

  getTotalPoints(): number {
    return this.children.reduce((sum, c) => sum + c.getTotalPoints(), 0);
  }

  getTimeLimitMinutes(): number {
    return this.children.reduce((sum, c) => sum + c.getTimeLimitMinutes(), 0);
  }

  getSectionCount(): number {
    return this.children.reduce((sum, c) => sum + (c.isComposite() ? (c as CompositeExamSection).getSectionCount() : 1), 0);
  }
}
