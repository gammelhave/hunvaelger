// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // evt. 'query' ved debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
