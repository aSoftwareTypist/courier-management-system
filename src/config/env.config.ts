import 'dotenv/config';

const env = {
  PORT: parseInt(process.env['PORT'] ?? '8001', 10),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  DATABASE_URL: process.env['DATABASE_URL'] ?? '',
  SESSION_SECRET: process.env['SESSION_SECRET'] ?? 'cms-super-secret-key-change-in-production',
};

export default env;