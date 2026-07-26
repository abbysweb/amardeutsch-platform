import { NextResponse } from 'next/server';
import path from 'path';
import { JsonRepository } from '@/repositories/JsonRepository';
import { ContentService } from '@/services/ContentService';

// ==========================================
// OOP DEPENDENCY INJECTION
// ==========================================
// We instantiate the Service with our concrete JSON Repository.
// When we are ready to move to Prisma/SQLite, we simply swap 
// JsonRepository with PrismaRepository here. The rest of the app stays the same!
const frontendSrc = path.join(process.cwd(), '../Frontend/src');
const repository = new JsonRepository(frontendSrc);
const contentService = new ContentService(repository);

// Helper to convert the raw 'filePath' from the UI into our OOP ContentIdentifier
function extractIdentifier(filePath: string) {
  // filePath comes in as e.g. "a1/grammar/data.json" or "../data/custom-content.json"
  if (filePath.startsWith('../data/')) {
     const section = filePath.replace('../data/', '').replace('.json', '');
     return { level: 'data', section };
  }
  
  const parts = filePath.split('/');
  return { level: parts[0], section: parts[1] };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath || (filePath.includes('..') && !filePath.startsWith('../data/'))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const id = extractIdentifier(filePath);
    const data = await contentService.getContent(id.level, id.section);
    
    if (!data) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in OOP GET:', error);
    return NextResponse.json({ error: error.message || 'Failed to read' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath || (filePath.includes('..') && !filePath.startsWith('../data/'))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const body = await request.json();
    const id = extractIdentifier(filePath);
    
    // The Service Layer entirely abstracts away the backup logic and file writing
    const result = await contentService.updateContent(id.level, id.section, body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in OOP POST:', error);
    return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 });
  }
}
