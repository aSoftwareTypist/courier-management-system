import { parcelRepository } from '../repositories/parcel.repository.js';
import CustomError from '../utils/CustomError.js';

export const trackingService = {
  findByTrackingNumber: async (trackingNumber: string) => {
    const parcel = await parcelRepository.findByTrackingNumber(
      trackingNumber.trim().toUpperCase(),
    );
    if (!parcel) throw new CustomError(404, 'Tracking number not found');
    return parcel;
  },
};
