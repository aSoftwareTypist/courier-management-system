import type { Request, Response } from 'express';
import { routeService } from '../services/route.service.js';
import { createRouteSchema, optimizeRouteSchema } from '../validations/route.validation.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const listRoutes = wrapRequest(
  async (_req: Request, res: Response): Promise<void> => {
    const routes = await routeService.getAll();
    res.render('routes', { title: 'Route Optimizer', routes });
  },
);

export const createRoute = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = createRouteSchema.safeParse(req.body);
    if (!result.success) {
      req.session.flash = {
        type: 'error',
        message: result.error.errors[0]?.message ?? 'Validation failed',
      };
      res.redirect('/routes');
      return;
    }
    await routeService.create(result.data);
    req.session.flash = { type: 'success', message: 'Route created.' };
    res.redirect('/routes');
  },
);

export const optimizeRoute = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const result = optimizeRouteSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0]?.message ?? 'Validation failed' });
      return;
    }
    const route = await routeService.optimize(result.data.routeId, result.data.points);
    res.json({ success: true, route });
  },
);

export const deleteRoute = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] ?? '0', 10);
    await routeService.delete(id);
    req.session.flash = { type: 'success', message: 'Route deleted.' };
    res.redirect('/routes');
  },
);
