// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Undgå at skabe nye klienter ved hot-reload i dev
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'], // tilpas evt. til ['query','info','warn','error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
