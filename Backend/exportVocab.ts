import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportMasterVocab() {
  console.log("Exporting vocabulary to master JSON file...");
  try {
    const vocab = await prisma.vocabulary.findMany({
      orderBy: { id: 'asc' }
    });

    const outputPath = path.join(__dirname, '..', 'Frontend', 'src', 'data', 'master-vocabulary.json');
    
    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(vocab, null, 2), 'utf-8');
    console.log(`Successfully exported ${vocab.length} words to ${outputPath}`);
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportMasterVocab();
