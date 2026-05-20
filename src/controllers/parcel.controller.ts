import type { Request, Response } from 'express';
import { parcelService } from '../services/parcel.service.js';
import { branchService } from '../services/branch.service.js';
import { createParcelSchema, updateParcelSchema } from '../validations/parcel.validation.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const listParcels = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(String(req.query['page'] ?? '1'), 10);
    const [parcels, branches] = await Promise.all([
      parcelService.getAll(page, 20),
      branchService.getAll(),
    ]);
    res.render('parcels', { title: 'Parcels', parcels, branches, page });
  },
);

export const createParcel = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = createParcelSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/parcels');
      return;
    }
    await parcelService.create(result.data);
    req.session.flash = { type: 'success', message: 'Parcel created successfully.' };
    res.redirect('/parcels');
  },
);

export const updateParcel = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    const result = updateParcelSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/parcels');
      return;
    }
    await parcelService.updateStatus(id, result.data);
    req.session.flash = { type: 'success', message: 'Parcel status updated.' };
    res.redirect('/parcels');
  },
);

export const deleteParcel = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    await parcelService.delete(id);
    req.session.flash = { type: 'success', message: 'Parcel deleted.' };
    res.redirect('/parcels');
  },
);
