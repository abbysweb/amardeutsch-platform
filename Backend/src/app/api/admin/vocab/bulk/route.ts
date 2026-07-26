import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Expected an array of vocabulary items" }, { status: 400 });
    }

    let insertedCount = 0;
    const errors = [];

    // Process sequentially to handle unique constraints properly with SQLite
    for (const item of data) {
      try {
        await prisma.vocabulary.create({
          data: {
            german: item.german,
            english: item.english,
            article: item.article || null,
            plural: item.plural || null,
            levelId: item.levelId || 'a1',
            categoryId: parseInt(item.categoryId, 10) || 1,
            germanSentence: item.germanSentence || null,
            englishSentence: item.englishSentence || null,
          }
        });
        insertedCount++;
      } catch (e: any) {
        // Log the duplicate/error and skip
        errors.push({ word: item.german, reason: e.message });
      }
    }

    return NextResponse.json({
      success: true,
      insertedCount,
      errorsCount: errors.length,
      message: `Successfully imported ${insertedCount} words. Skipped ${errors.length} duplicates or errors.`
    });

  } catch (error) {
    console.error("Bulk POST Error:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}
