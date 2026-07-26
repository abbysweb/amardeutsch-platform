import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to our custom content JSON database
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/customContent.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading custom content:', error);
    // If the file doesn't exist or is invalid, return an empty array
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Read existing data
    let existingData = [];
    try {
      const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf8');
      existingData = JSON.parse(fileContents);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    // Prepend to array so newest is first
    const updatedData = [newEntry, ...existingData];

    // Write back to file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error('Error saving custom content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
