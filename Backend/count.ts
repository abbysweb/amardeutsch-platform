import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function count() {
  const c = await prisma.vocabulary.count();
  console.log("Total Vocab: ", c);
}

count().finally(() => prisma.$disconnect());
