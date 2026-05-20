import type { Request, Response, NextFunction } from 'express';
import env from '../config/env.config.js';

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
  }
  next();
};
