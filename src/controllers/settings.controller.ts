import type { Request, Response } from 'express';
import { systemSettingService } from '../services/systemSetting.service.js';
import wrapRequest from '../utils/wrapRequest.util.js';
import { z } from 'zod';

const settingsSchema = z.object({
  name: z.string().min(1, 'Company name required'),
  email: z.string().email('Invalid email'),
  contact: z.string().min(1, 'Contact required'),
  address: z.string().min(1, 'Address required'),
});

export const showSettings = wrapRequest(
  async (_req: Request, res: Response): Promise<void> => {
    const settings = await systemSettingService.get();
    res.render('settings', { title: 'System Settings', settings });
  },
);

export const updateSettings = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = settingsSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/settings');
      return;
    }
    await systemSettingService.upsert(result.data);
    req.session.flash = { type: 'success', message: 'Settings saved.' };
    res.redirect('/settings');
  },
);
