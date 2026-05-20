import type { Request, Response } from 'express';
import { branchService } from '../services/branch.service.js';
import { createBranchSchema, updateBranchSchema } from '../validations/branch.validation.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const listBranches = wrapRequest(
  async (_req: Request, res: Response): Promise<void> => {
    const branches = await branchService.getAll();
    res.render('branches', { title: 'Branches', branches });
  },
);

export const createBranch = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = createBranchSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/branches');
      return;
    }
    await branchService.create(result.data);
    req.session.flash = { type: 'success', message: 'Branch created successfully.' };
    res.redirect('/branches');
  },
);

export const updateBranch = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    const result = updateBranchSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/branches');
      return;
    }
    await branchService.update(id, result.data);
    req.session.flash = { type: 'success', message: 'Branch updated.' };
    res.redirect('/branches');
  },
);

export const deleteBranch = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    await branchService.delete(id);
    req.session.flash = { type: 'success', message: 'Branch deleted.' };
    res.redirect('/branches');
  },
);
