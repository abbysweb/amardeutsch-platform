import { NextResponse } from 'next/server';
import { ContentService } from '@/services/ContentService';
import { PrismaRepository } from '@/repositories/PrismaRepository';

const repo = new PrismaRepository();
const service = new ContentService(repo);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;
  try {
    const data = await service.getContent(level, 'grammar');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
