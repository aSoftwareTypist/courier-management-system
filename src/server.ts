import prisma from './config/prisma.config.js';
import env from './config/env.config.js';
import app from './app.js';

// Bootstrap
async function bootstrap(): Promise<void> {
  // Connect to database
  try {
    await prisma.$connect();
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });

  server.on('error', (err: Error) => {
    console.error('Fatal server error:', err.message);
    process.exit(1);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n⚡ ${signal} received. Shutting down...`);
    server.close(async () => {
      console.log('🔌 HTTP server closed.');
      try {
        await prisma.$disconnect();
        console.log('🔌 Database disconnected.');
        process.exit(0);
      } catch (err) {
        console.error('Error during disconnect:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap();
