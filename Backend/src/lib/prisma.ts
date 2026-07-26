import { PrismaClient } from '@prisma/client';

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
      await prisma.$executeRawUnsafe('PRAGMA journal_mode = WAL;');
      await prisma.$executeRawUnsafe('PRAGMA synchronous = NORMAL;');
      await prisma.$executeRawUnsafe('PRAGMA busy_timeout = 5000;');
      await prisma.$executeRawUnsafe('PRAGMA cache_size = -64000;'); // Allocate ~64MB memory cache
      await prisma.$executeRawUnsafe('PRAGMA temp_store = MEMORY;');
    } catch (err) {
      // PRAGMAs might error if db is currently in use or read-only during initialization
    }
  })
  .catch((err: unknown) => {
    console.error('Prisma connection error:', err);
  });
