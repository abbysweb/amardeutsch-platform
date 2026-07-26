import { PrismaClient } from '@prisma/client';
import { IContentRepository, ContentIdentifier } from './IRepository';

// Singleton instance to prevent multiple connections during dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export class PrismaRepository implements IContentRepository {
  async readContent(id: ContentIdentifier): Promise<any> {
    if (id.section === 'vocab') {
      const words = await prisma.vocabulary.findMany({
        where: { levelId: id.level },
        include: { category: true }
      });
      // Map it back to the exact shape the UI expects
      return words.map(w => ({
        id: w.id.toString(),
        german: w.german,
        english: w.english,
        category: w.category.name,
        level: id.level.toUpperCase(),
        article: w.article || undefined,
        plural: w.plural || undefined,
        germanSentence: w.germanSentence || undefined,
        englishSentence: w.englishSentence || undefined
      }));
    }

    if (id.section === 'grammar') {
      const lessons = await prisma.grammarLesson.findMany({
        where: { levelId: id.level },
        include: {
          category: true,
          subtopics: { orderBy: { order: 'asc' } },
          examples: { orderBy: { order: 'asc' } },
          conjugation: { orderBy: { order: 'asc' } },
          errorTraps: { orderBy: { order: 'asc' } },
        }
      });
      return lessons.map(l => ({
        id: l.id.toString(),
        title: l.title,
        description: l.description,
        content: l.content,
        category: l.category.name,
        level: id.level.toUpperCase(),
        testable: l.testable,
        subtopics: l.subtopics.map(s => s.text),
        examples: l.examples.map(e => ({ german: e.german, english: e.english })),
        conjugationTable: l.conjugation.map(c => c.text),
        errorTraps: l.errorTraps.map(e => e.text)
      }));
    }

    // Fallback for sections not yet migrated to DB (quizzes, sentences, exam)
    return [];
  }

  async writeContent(id: ContentIdentifier, data: any): Promise<boolean> {
    console.warn('writeContent not yet implemented for PrismaRepository');
    return false;
  }

  async backupContent(id: ContentIdentifier): Promise<boolean> {
    console.warn('backupContent not yet implemented for PrismaRepository');
    return false;
  }
}
