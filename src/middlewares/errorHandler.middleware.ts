import type { Request, Response, NextFunction } from 'express';
import env from '../config/env.config.js';
import CustomError from '../utils/CustomError.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (env.NODE_ENV === 'development') {
    console.error('[ERROR]', err);
  }

  if (err instanceof CustomError) {
    res.status(err.code).render('error', {
      title: 'Error',
      message: err.message,
      status: err.code,
      stack: env.NODE_ENV === 'development' ? String(err.errObj ?? '') : null,
      currentUser: req.session.user ?? null,
    });
    return;
  }

  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred';

  res.status(500).render('error', {
    title: 'Server Error',
    message,
    status: 500,
    stack: env.NODE_ENV === 'development' && err instanceof Error ? err.stack : null,
    currentUser: req.session.user ?? null,
  });
};
