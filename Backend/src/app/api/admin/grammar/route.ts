import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  
  const where: any = {};
  if (search) {
    where.title = { contains: search };
  }

  try {
    const grammar = await prisma.grammarLesson.findMany({
      where,
      orderBy: { id: 'desc' },
      take: 100,
    });
    return NextResponse.json(grammar);
  } catch (error) {
    console.error("GET Grammar Error:", error);
    return NextResponse.json({ error: "Failed to fetch grammar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, description, content, testable, levelId, categoryId } = data;

    const newGrammar = await prisma.grammarLesson.create({
      data: {
        title,
        description,
        content,
        testable: !!testable,
        levelId,
        categoryId: parseInt(categoryId, 10) || 1,
      }
    });

    return NextResponse.json(newGrammar);
  } catch (error) {
    console.error("POST Grammar Error:", error);
    return NextResponse.json({ error: "Failed to create grammar rule" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, title, description, content, testable, levelId, categoryId } = data;

    const updated = await prisma.grammarLesson.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        content,
        testable: !!testable,
        levelId,
        categoryId: parseInt(categoryId, 10) || 1,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Grammar Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.grammarLesson.delete({
      where: { id: parseInt(id, 10) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Grammar Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}
