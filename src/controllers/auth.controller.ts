import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { loginSchema } from '../validations/auth.validation.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const showLogin = wrapRequest((_req: Request, res: Response): void => {
  res.render('login', { title: 'Login' });
});

export const login = wrapRequest(async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    req.session.flash = {
      type: 'error',
      message: result.error.errors[0]?.message ?? 'Validation failed',
    };
    res.redirect('/login');
    return;
  }

  const user = await authService.login(result.data.email, result.data.password);
  req.session.user = user;
  req.session.flash = { type: 'success', message: `Welcome back, ${user.firstName}!` };
  res.redirect('/dashboard');
});

export const logout = wrapRequest((req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
