/**
 * @fileoverview
 * Next.js API Route for the Vocabulary Database.
 * Provides CRUD operations (GET, POST, PUT, DELETE) and handles CORS (OPTIONS).
 * Uses Prisma to interact with the underlying SQLite database and dynamically matches 
 * sentences to words via the `SentenceMatcherService`.
 */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SentenceMatcherService } from '@/services/SentenceMatcherService';

const prisma = new PrismaClient();
const sentenceMatcher = new SentenceMatcherService();

/**
 * Handles GET requests to retrieve vocabulary items.
 * 
 * @param req - The incoming request object.
 * @returns A JSON response containing an array of vocabulary objects, enhanced with dynamically matched sentences.
 * 
 * Query Parameters:
 * - `search` (optional): A string to fuzzy-match against german, english, or sentence fields.
 * - `level` (optional): A CEFR level string (e.g., 'a1', 'b2') to filter the results.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const level = searchParams.get('level');

  const where: any = {};
  if (search) {
    where.OR = [
      { german: { contains: search } },
      { english: { contains: search } },
      { germanSentence: { contains: search } },
      { englishSentence: { contains: search } },
    ];
  }
  if (level) {
    where.levelId = level.toLowerCase();
  }

  try {
    const vocab = await prisma.vocabulary.findMany({
      where,
      include: { category: true },
      orderBy: { id: 'desc' }
    });

    const groupedByLevel = vocab.reduce((acc: any, v: any) => {
      const level = v.levelId.toLowerCase();
      if (!acc[level]) acc[level] = [];
      acc[level].push({
        id: v.id,
        german: v.german,
        english: v.english,
        article: v.article,
        plural: v.plural,
        levelId: v.levelId,
        level: v.levelId.toUpperCase(),
        categoryId: v.categoryId,
        category: v.category?.name,
        germanSentence: v.germanSentence,
        englishSentence: v.englishSentence,
      });
      return acc;
    }, {});

    let result: any[] = [];
    for (const [level, words] of Object.entries(groupedByLevel)) {
      const matched = sentenceMatcher.matchSentences(words as any[], level);
      result.push(...matched);
    }

    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error) {
    console.error("GET Vocab Error:", error);
    return NextResponse.json({ error: "Failed to fetch vocabulary" }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new vocabulary item.
 * 
 * @param req - The incoming request containing the new word payload in JSON format.
 * @returns A JSON response of the newly created vocabulary database record, or a 400 error.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { german, english, article, plural, levelId, categoryId, germanSentence, englishSentence } = data;

    const newVocab = await prisma.vocabulary.create({
      data: {
        german,
        english,
        article: article || null,
        plural: plural || null,
        levelId,
        germanSentence: germanSentence || null,
        englishSentence: englishSentence || null,
        categoryId: parseInt(categoryId, 10) || 1,
      }
    });

    return NextResponse.json(newVocab);
  } catch (error) {
    console.error("POST Vocab Error:", error);
    return NextResponse.json({ error: "Failed to create. Possibly a duplicate." }, { status: 400 });
  }
}

/**
 * Handles PUT requests to update an existing vocabulary item.
 * 
 * @param req - The incoming request containing the updated fields and the `id` of the record to update.
 * @returns A JSON response of the updated vocabulary record, or a 400 error.
 */
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, german, english, article, plural, levelId, categoryId, germanSentence, englishSentence } = data;

    const updated = await prisma.vocabulary.update({
      where: { id: parseInt(id, 10) },
      data: {
        german,
        english,
        article: article || null,
        plural: plural || null,
        levelId,
        germanSentence: germanSentence || null,
        englishSentence: englishSentence || null,
        categoryId: parseInt(categoryId, 10) || 1,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Vocab Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 400 });
  }
}

/**
 * Handles DELETE requests to remove a vocabulary item by its ID.
 * 
 * @param req - The incoming request. Must contain an `id` query parameter.
 * @returns A success boolean, or a 400 error if the deletion fails.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.vocabulary.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Vocab Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}

/**
 * Handles OPTIONS requests to resolve CORS preflight checks.
 * Ensures the Frontend can successfully communicate with the Backend API across different ports.
 */
export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
