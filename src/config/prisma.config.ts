import { PrismaClient } from '@prisma/client';
import env from './env.config.js';

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
