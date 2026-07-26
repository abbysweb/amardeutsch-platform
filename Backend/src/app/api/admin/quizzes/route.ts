import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Handles GET requests to retrieve quizzes.
 * Supports filtering by CEFR level (`level=A1`, `level=B2`) and searching by title/description.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const level = searchParams.get('level');

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } }
    ];
  }
  if (level && level.toLowerCase() !== 'all') {
    where.levelId = level.toLowerCase();
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        level: true
      },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("GET Quizzes Error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes.", details: error?.message || String(error), stack: error?.stack }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new quiz with its questions.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, description, category, quizType, levelId = 'a1', questions = [] } = data;

    const normalizedLevel = (levelId || "a1").toLowerCase();
    const upperLevel = normalizedLevel.toUpperCase();

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        description,
        category: category || "General Grammar",
        quizType: quizType || "multiple_choice",
        level: {
          connectOrCreate: {
            where: { id: normalizedLevel },
            create: { id: normalizedLevel, name: upperLevel }
          }
        },
        questions: {
          create: (questions || []).map((q: any, idx: number) => ({
            english: q.english || null,
            explanation: q.explanation || null,
            order: idx + 1,
            question: q.question || null,
            options: q.options ? (typeof q.options === 'string' ? q.options : JSON.stringify(q.options)) : null,
            correctIndex: q.correctIndex !== undefined ? Number(q.correctIndex) : 0,
            sentenceBefore: q.sentenceBefore || null,
            blankWord: q.blankWord || null,
            sentenceAfter: q.sentenceAfter || null,
            hint: q.hint || null
          }))
        }
      },
      include: { questions: true }
    });

    return NextResponse.json(newQuiz);
  } catch (error) {
    console.error("POST Quiz Error:", error);
    return NextResponse.json({ error: "Failed to create quiz." }, { status: 400 });
  }
}

/**
 * Handles PUT requests to update an existing quiz and its question set.
 */
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, title, description, category, quizType, levelId, questions = [] } = data;

    if (!id) return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });

    const quizId = parseInt(id, 10);
    const normalizedLevel = (levelId || "a1").toLowerCase();
    const upperLevel = normalizedLevel.toUpperCase();

    // Remove existing questions cleanly before re-attaching updated ones
    await prisma.quizQuestion.deleteMany({ where: { quizId } });

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title,
        description,
        category: category || "General Grammar",
        quizType: quizType || "multiple_choice",
        level: {
          connectOrCreate: {
            where: { id: normalizedLevel },
            create: { id: normalizedLevel, name: upperLevel }
          }
        },
        questions: {
          create: (questions || []).map((q: any, idx: number) => ({
            english: q.english || null,
            explanation: q.explanation || null,
            order: idx + 1,
            question: q.question || null,
            options: q.options ? (typeof q.options === 'string' ? q.options : JSON.stringify(q.options)) : null,
            correctIndex: q.correctIndex !== undefined ? Number(q.correctIndex) : 0,
            sentenceBefore: q.sentenceBefore || null,
            blankWord: q.blankWord || null,
            sentenceAfter: q.sentenceAfter || null,
            hint: q.hint || null
          }))
        }
      },
      include: { questions: true }
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("PUT Quiz Error:", error);
    return NextResponse.json({ error: "Failed to update quiz." }, { status: 400 });
  }
}

/**
 * Handles DELETE requests to remove a quiz and all its questions.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.quiz.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Quiz Error:", error);
    return NextResponse.json({ error: "Failed to delete quiz." }, { status: 400 });
  }
}

export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
