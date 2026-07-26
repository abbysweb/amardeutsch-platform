import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const levels = ['a1', 'a2', 'b1', 'b2'];

async function main() {
  console.log("Starting vocab sync...");
  let totalImported = 0;

  for (const level of levels) {
    const filePath = path.join(__dirname, '..', 'Frontend', 'src', 'levels', level, 'vocab', 'data.json');
    if (!fs.existsSync(filePath)) {
      console.log(`Missing file: ${filePath}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Found ${data.length} words in ${level.toUpperCase()}`);

    // Bulk insert using Prisma
    // We map to match the Prisma schema
    const formattedData = data.map((item: any) => ({
      german: item.german || item.word || "Unknown",
      english: item.english || item.translation || "Unknown",
      article: item.article || null,
      plural: item.plural || null,
      levelId: level,
      categoryId: 1 // Default to 1
    }));

    // Insert in batches of 500 to prevent SQLite limits
    for (const item of formattedData) {
      try {
        await prisma.vocabulary.create({
          data: item
        });
        totalImported++;
      } catch (e: any) {
        if (!e.message.includes('Unique constraint')) {
            console.error(e.message);
        }
      }
    }
    
    console.log(`Successfully synced ${level.toUpperCase()}`);
  }

  console.log(`Finished! Processed ${totalImported} words.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
