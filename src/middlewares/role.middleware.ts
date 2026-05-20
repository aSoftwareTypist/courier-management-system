import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/index.js';

export const roleMiddleware = (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = req.session.user;
    if (!user) {
      res.redirect('/login');
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.',
        status: 403,
        currentUser: user,
      });
      return;
    }
    next();
  };
