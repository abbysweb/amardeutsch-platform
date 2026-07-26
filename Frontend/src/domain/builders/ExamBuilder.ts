import { Exam, type ExamSection, type ExamQuestion } from '../entities/Exam';
import type { CEFRLevel } from '../../levels/cefr';

export class ExamBuilder {
  private id: string = '';
  private level: CEFRLevel = 'A1' as CEFRLevel;
  private title: string = '';
  private description: string = '';
  private totalTimeMinutes: number = 60;
  private passingScore: number = 60;
  private sections: ExamSection[] = [];

  setId(id: string): this {
    this.id = id;
    return this;
  }

  setLevel(level: CEFRLevel): this {
    this.level = level;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setTotalTime(minutes: number): this {
    this.totalTimeMinutes = minutes;
    return this;
  }

  setPassingScore(score: number): this {
    this.passingScore = score;
    return this;
  }

  addSection(section: ExamSection): this {
    this.sections.push(section);
    return this;
  }

  addQuestionToSection(sectionId: string, question: ExamQuestion): this {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      section.questions.push(question);
    }
    return this;
  }

  build(): Exam {
    if (!this.id) throw new Error('ExamBuilder: id is required');
    if (this.sections.length === 0) throw new Error('ExamBuilder: at least one section is required');
    return new Exam({
      id: this.id,
      level: this.level,
      title: this.title,
      description: this.description,
      totalTimeMinutes: this.totalTimeMinutes,
      sections: this.sections,
      passingScore: this.passingScore,
    });
  }
}
