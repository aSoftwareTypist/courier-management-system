import type { Request, Response } from 'express';
import { userService } from '../services/user.service.js';
import { branchService } from '../services/branch.service.js';
import { createUserSchema, updateUserSchema } from '../validations/user.validation.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const listUsers = wrapRequest(
  async (_req: Request, res: Response): Promise<void> => {
    const [users, branches] = await Promise.all([
      userService.getAll(),
      branchService.getAll(),
    ]);
    res.render('users', { title: 'Users', users, branches });
  },
);

export const createUser = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/users');
      return;
    }
    await userService.create(result.data);
    req.session.flash = { type: 'success', message: 'User created successfully.' };
    res.redirect('/users');
  },
);

export const updateUser = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/users');
      return;
    }
    const data = result.data;
    if (!data.password) delete data.password;
    await userService.update(id, data);
    req.session.flash = { type: 'success', message: 'User updated.' };
    res.redirect('/users');
  },
);

export const deleteUser = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    await userService.delete(id);
    req.session.flash = { type: 'success', message: 'User deleted.' };
    res.redirect('/users');
  },
);
