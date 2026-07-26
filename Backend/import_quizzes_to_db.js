/**
 * @fileoverview
 * Master Database Sync Script for CEFR Quizzes (A1 - B2)
 * Imports all curated frontend JSON quiz files into SQLite (dev.db) via Prisma.
 * Enables full Admin CRUD on every single question across all CEFR levels.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const LEVELS_CONFIG = [
  { level: 'a1', files: ['data.json', 'batch2.json', 'batch5.json', 'batch6.json', 'batch7.json', 'batch8.json', 'batch9.json', 'batch10.json'] },
  { level: 'a2', files: ['data.json'] },
  { level: 'b1', files: ['data.json'] },
  { level: 'b2', files: ['data.json'] }
];

async function importAllQuizzes() {
  console.log("🚀 Starting CEFR Quizzes Sync to SQLite Database (dev.db)...");

  let totalQuizzes = 0;
  let totalQuestions = 0;

  try {
    // 1. Ensure all CEFR Levels exist in Prisma
    for (const l of ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']) {
      await prisma.cefrLevel.upsert({
        where: { id: l },
        update: { name: l.toUpperCase() },
        create: { id: l, name: l.toUpperCase(), description: `GER Level ${l.toUpperCase()}` }
      });
    }

    // 2. Clear existing quizzes and questions to prevent duplicates and ensure a fresh, synchronized state
    console.log("🧹 Cleaning existing quiz database records for clean sync...");
    await prisma.quizQuestion.deleteMany({});
    await prisma.quiz.deleteMany({});
    console.log("✅ Database cleansed.");

    // 3. Iterate over levels and files
    for (const cfg of LEVELS_CONFIG) {
      const levelId = cfg.level;
      for (const fileName of cfg.files) {
        const filePath = path.join(__dirname, '..', 'Frontend', 'src', 'levels', levelId, 'quizzes', fileName);
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️ Missing file skipped: ${filePath}`);
          continue;
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        let quizzes;
        try {
          quizzes = JSON.parse(rawData);
        } catch (e) {
          console.error(`❌ JSON Parse Error in ${filePath}:`, e.message);
          continue;
        }

        if (!Array.isArray(quizzes) || quizzes.length === 0) {
          continue;
        }

        console.log(`📥 Importing ${quizzes.length} quizzes from [${levelId.toUpperCase()}] ${fileName}...`);

        for (const q of quizzes) {
          const createdQuiz = await prisma.quiz.create({
            data: {
              title: q.title || "Grammar Challenge",
              description: q.description || "Test your German vocabulary and grammar skills.",
              category: q.category || "General Grammar",
              quizType: q.quizType || "multiple_choice",
              levelId: levelId,
              questions: {
                create: (q.questions || []).map((qst, idx) => ({
                  english: qst.english || null,
                  explanation: qst.explanation || null,
                  order: idx + 1,
                  question: qst.question || null,
                  options: qst.options ? (typeof qst.options === 'string' ? qst.options : JSON.stringify(qst.options)) : null,
                  correctIndex: qst.correctIndex !== undefined ? Number(qst.correctIndex) : 0,
                  sentenceBefore: qst.sentenceBefore || null,
                  blankWord: qst.blankWord || null,
                  sentenceAfter: qst.sentenceAfter || null,
                  hint: qst.hint || null
                }))
              }
            }
          });

          totalQuizzes++;
          totalQuestions += (q.questions || []).length;
        }
      }
    }

    console.log(`\n🎉 MASTER QUIZ SYNC COMPLETE!`);
    console.log(`📊 Successfully synchronized ${totalQuizzes} Quizzes with ${totalQuestions} interactive questions into dev.db!`);

  } catch (error) {
    console.error("❌ Error during Quiz Sync:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importAllQuizzes();
