import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.session.user) {
    res.locals['currentUser'] = req.session.user;
    next();
    return;
  }
  req.session.flash = { type: 'error', message: 'Please log in to continue.' };
  res.redirect('/login');
};
