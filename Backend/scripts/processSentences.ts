import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const curatedWords = [
  { german: 'gehen', english: 'to go', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'putzen', english: 'to clean / brush', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'arbeiten', english: 'to work', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'erzählen', english: 'to tell / narrate', article: null, levelId: 'a2', categoryId: 1 },
  { german: 'essen', english: 'to eat', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'wohnen', english: 'to live', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'kommen', english: 'to come', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'heißen', english: 'to be called', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'interessieren', english: 'to interest', article: null, levelId: 'b1', categoryId: 1 },
  { german: 'Bett', english: 'bed', article: 'das', levelId: 'a1', categoryId: 1 },
  { german: 'Zahn', english: 'tooth', article: 'der', levelId: 'a1', categoryId: 1 },
  { german: 'Name', english: 'name', article: 'der', levelId: 'a1', categoryId: 1 },
  { german: 'Geburtsort', english: 'place of birth', article: 'der', levelId: 'a2', categoryId: 1 },
  { german: 'Produktmanager', english: 'product manager', article: 'der', levelId: 'b1', categoryId: 1 },
  { german: 'Freizeit', english: 'free time', article: 'die', levelId: 'a1', categoryId: 1 },
  { german: 'Schule', english: 'school', article: 'die', levelId: 'a1', categoryId: 1 },
  { german: 'Fachzeitschrift', english: 'trade journal', article: 'die', levelId: 'b2', categoryId: 1 },
  { german: 'Geschichte', english: 'history / story', article: 'die', levelId: 'a2', categoryId: 1 },
  { german: 'Note', english: 'grade', article: 'die', levelId: 'a2', categoryId: 1 },
  { german: 'Zensur', english: 'grade / censorship', article: 'die', levelId: 'b1', categoryId: 1 },
  { german: 'verheiratet', english: 'married', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'ledig', english: 'single', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'geschieden', english: 'divorced', article: null, levelId: 'a1', categoryId: 1 },
  { german: 'selbst', english: 'oneself', article: null, levelId: 'a2', categoryId: 1 }
];

async function run() {
  console.log("Starting Sentence Splitter Data Migration...");
  
  // 1. Find all sentences (entries with > 1 space)
  const allVocab = await prisma.vocabulary.findMany();
  const sentencesToDelete = allVocab.filter((v: any) => v.german.split(' ').length > 2);
  
  console.log(`Found ${sentencesToDelete.length} sentences to delete.`);

  // 2. Delete them
  let deletedCount = 0;
  for (const s of (sentencesToDelete as any[])) {
    try {
      await prisma.vocabulary.delete({ where: { id: s.id } });
      deletedCount++;
    } catch (e) {
      console.error(`Failed to delete ${s.id}`, e);
    }
  }
  console.log(`Successfully deleted ${deletedCount} sentences.`);

  // 3. Insert curated words
  let insertedCount = 0;
  for (const w of curatedWords) {
    try {
      await prisma.vocabulary.create({
        data: {
          german: w.german,
          english: w.english,
          article: w.article,
          levelId: w.levelId,
          categoryId: w.categoryId,
        }
      });
      insertedCount++;
    } catch (e) {
      // Ignore duplicates
    }
  }
  console.log(`Inserted ${insertedCount} new root words.`);
  
  // 4. Export new master JSON
  const finalVocab = await prisma.vocabulary.findMany({ orderBy: { id: 'asc' } });
  const outputPath = path.join(__dirname, '..', 'Frontend', 'src', 'data', 'master-vocabulary.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalVocab, null, 2), 'utf-8');
  console.log(`Exported ${finalVocab.length} words to master-vocabulary.json.`);
}

run()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
