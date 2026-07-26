import { NextResponse } from 'next/server';
import { ContentService } from '@/services/ContentService';
import { PrismaRepository } from '@/repositories/PrismaRepository';
import { SentenceMatcherService } from '@/services/SentenceMatcherService';

const repo = new PrismaRepository();
const service = new ContentService(repo);
const sentenceMatcher = new SentenceMatcherService();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;
  try {
    const data = await service.getContent(level, 'vocab');
    const matched = sentenceMatcher.matchSentences(data, level);
    return NextResponse.json(matched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
