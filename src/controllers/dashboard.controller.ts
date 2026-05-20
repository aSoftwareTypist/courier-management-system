import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const showDashboard = wrapRequest(
  async (_req: Request, res: Response): Promise<void> => {
    const [stats, recentParcels] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentParcels(8),
    ]);
    res.render('dashboard', { title: 'Dashboard', stats, recentParcels });
  },
);
