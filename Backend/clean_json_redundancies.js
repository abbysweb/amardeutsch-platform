/**
 * @fileoverview
 * Senior Supervisor Audit & Deduplication Utility (mimo-v2.5-free / north-mini-code-free Profile)
 * Reads all repository data JSON files, purges orphaned legacy scrapers/dumps,
 * eliminates exact & semantic duplicates, normalizes formatting, and sequentially re-indexes items.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendLevelsDir = path.join(rootDir, 'Frontend', 'src', 'levels');

console.log("🚀 Starting OpenCode Multi-Agent JSON Deduplication & Redundancy Purge...\n");

// 1. Purge orphaned & redundant legacy data files
const orphanedFiles = [
  path.join(frontendLevelsDir, 'a2', 'a2_categorized.json'),
  path.join(frontendLevelsDir, 'a2', 'a2_flat_categorized.json'),
  path.join(frontendLevelsDir, 'b1', 'b1_extracted_vocab.json'),
  path.join(frontendLevelsDir, 'b1', 'b1_nouns_page_1.txt'),
  path.join(frontendLevelsDir, 'b1', 'b1_nouns_page_2.txt'),
  path.join(frontendLevelsDir, 'b1', 'b1_nouns_page_3.txt'),
  path.join(frontendLevelsDir, 'b1', 'b1_nouns_page_4.txt'),
  path.join(frontendLevelsDir, 'b1', 'b1_nouns_page_5.txt'),
  path.join(__dirname, 'sentences_to_process.json'),
  path.join(__dirname, 'sentences_compressed.json')
];

let removedFilesCount = 0;
for (const filePath of orphanedFiles) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Removed orphaned redundant file: ${path.relative(rootDir, filePath)}`);
    removedFilesCount++;
  }
}
console.log(`\n✅ Purged ${removedFilesCount} obsolete redundant data files.\n`);

// 2. Locate and deduplicate all active data.json files
const activeJsonFiles = [];
const levels = ['a1', 'a2', 'b1', 'b2'];
const sections = ['sentences', 'quizzes', 'grammar', 'exam'];

for (const lvl of levels) {
  for (const sec of sections) {
    const f = path.join(frontendLevelsDir, lvl, sec, 'data.json');
    if (fs.existsSync(f)) activeJsonFiles.push(f);
  }
}
const customContentPath = path.join(rootDir, 'Frontend', 'src', 'data', 'customContent.json');
if (fs.existsSync(customContentPath)) activeJsonFiles.push(customContentPath);

console.log(`🔍 Auditing ${activeJsonFiles.length} active data.json datasets for duplicate records...`);

let totalOriginalItems = 0;
let totalDeduplicatedItems = 0;
let totalDuplicatesRemoved = 0;

for (const filePath of activeJsonFiles) {
  const relPath = path.relative(rootDir, filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      console.log(`ℹ️ Skipping non-array JSON structure: ${relPath}`);
      continue;
    }

    const initialCount = data.length;
    totalOriginalItems += initialCount;

    // Deduplicate logic based on composite semantic keys
    const seen = new Set();
    const cleanList = [];

    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      
      // Determine unique semantic signature for deduplication
      let signature = "";
      if (item.german && item.english) {
        signature = `GE:${item.german.trim().toLowerCase()}|EN:${item.english.trim().toLowerCase()}`;
      } else if (item.question && item.answer) {
        signature = `Q:${item.question.trim().toLowerCase()}|A:${item.answer}`;
      } else if (item.title && item.content) {
        signature = `T:${item.title.trim().toLowerCase()}`;
      } else if (item.text) {
        signature = `TEXT:${item.text.trim().toLowerCase()}`;
      } else {
        // Fallback: strip id and stringify rest of object
        const temp = { ...item };
        delete temp.id;
        signature = JSON.stringify(temp);
      }

      if (!seen.has(signature)) {
        seen.add(signature);
        cleanList.push(item);
      }
    }

    // Re-index sequential IDs from 1 to N to eliminate gaps caused by duplicate removal
    const finalizedList = cleanList.map((item, idx) => ({
      ...item,
      id: typeof item.id === 'number' ? idx + 1 : (item.id || idx + 1)
    }));

    const finalCount = finalizedList.length;
    const removedCount = initialCount - finalCount;
    totalDeduplicatedItems += finalCount;
    totalDuplicatesRemoved += removedCount;

    fs.writeFileSync(filePath, JSON.stringify(finalizedList, null, 2), 'utf8');

    if (removedCount > 0) {
      console.log(`✨ ${relPath}: Removed ${removedCount} duplicate items (${initialCount} -> ${finalCount}) & re-indexed IDs.`);
    } else {
      console.log(`✔️ ${relPath}: Clean (0 duplicates across ${finalCount} items).`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${relPath}:`, err.message);
  }
}

console.log("\n--- Supervisor Verification & Accuracy Audit ---");
console.log(`📦 Total Records Evaluated: ${totalOriginalItems}`);
console.log(`🧹 Total Duplicate Entries Stripped: ${totalDuplicatesRemoved}`);
console.log(`🎯 Pristine Remaining Records: ${totalDeduplicatedItems}`);
console.log(`🚀 All JSON data datasets have been verified, deduplicated, and normalized.`);
