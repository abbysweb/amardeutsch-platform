import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Architectural Vercel Serverless Optimization & Read-Only Protection:
// In Vercel cloud environments and build containers, environment variables like DATABASE_URL may be unassigned,
// and serverless execution paths (/var/task or /vercel/path0) are strictly read-only.
// To guarantee zero build failures and prevent SQLite write errors during mutations or WAL PRAGMAs,
// we automatically fallback DATABASE_URL and mirror dev.db to the writable ephemeral memory filesystem (/tmp).
if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
  try {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const sourceDbPath = path.join(process.cwd(), 'dev.db');
    
    // Mirror database to writable /tmp filesystem if it does not already exist
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
    }
    
    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    } else {
      process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${sourceDbPath}`;
    }
  } catch (e) {
    // Fallback if fs access is restricted during early build evaluation
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
  }
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Architectural Database Optimization:
// Automatically configure SQLite PRAGMAs for high-concurrency WAL (Write-Ahead Logging) mode,
// larger in-memory paging cache, and optimized synchronous transactions to eliminate I/O bottlenecks.
prisma.$connect()
  .then(async () => {
    try {
      await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
      await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
      await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 5000;');
      await prisma.$queryRawUnsafe('PRAGMA cache_size = -64000;'); // Allocate ~64MB memory cache
      await prisma.$queryRawUnsafe('PRAGMA temp_store = MEMORY;');
    } catch (err) {
      // PRAGMAs might error if db is currently in use or read-only during initialization
    }
  })
  .catch((err: unknown) => {
    console.error('Prisma connection error:', err);
  });
