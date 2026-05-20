import type { Request, Response } from 'express';
import { trackingService } from '../services/tracking.service.js';
import CustomError from '../utils/CustomError.js';
import wrapRequest from '../utils/wrapRequest.util.js';

export const showTracking = wrapRequest(
  (_req: Request, res: Response): void => {
    res.render('tracking', { title: 'Track Parcel', parcel: null, error: null });
  },
);

export const searchTracking = wrapRequest(
  async (req: Request, res: Response): Promise<void> => {
    const trackingNumber = String(req.body['trackingNumber'] ?? '').trim();
    if (!trackingNumber) {
      res.render('tracking', {
        title: 'Track Parcel',
        parcel: null,
        error: 'Please enter a tracking number.',
      });
      return;
    }
    try {
      const parcel = await trackingService.findByTrackingNumber(trackingNumber);
      res.render('tracking', { title: 'Track Parcel', parcel, error: null });
    } catch (err) {
      if (err instanceof CustomError && err.code === 404) {
        res.render('tracking', {
          title: 'Track Parcel',
          parcel: null,
          error: `No parcel found with tracking number: ${trackingNumber}`,
        });
        return;
      }
      throw err;
    }
  },
);
