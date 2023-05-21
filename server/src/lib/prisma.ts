import { PrismaClient } from '@prisma/client'
// it is possible to already set a log configuration that will work globally
export const prisma = new PrismaClient({
  log: ['query']
})