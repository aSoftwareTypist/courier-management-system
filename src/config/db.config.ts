import { PrismaClient } from '@prisma/client';
import { databaseConfig } from './env.config.js';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseConfig.DATABASE_URL,
    },
  },
  log: ['query', 'error', 'warn'],
});
