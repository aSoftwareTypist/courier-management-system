import type { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).render('error', {
    title: '404 Not Found',
    message: `The page "${req.path}" does not exist.`,
    status: 404,
    stack: null,
    currentUser: req.session.user ?? null,
  });
};
