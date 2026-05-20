import { parcelRepository } from '../repositories/parcel.repository.js';
import CustomError from '../utils/CustomError.js';
import type { CreateParcelDto, UpdateParcelDto } from '../types/index.js';

const generateTrackingNumber = (): string => {
  const prefix = 'CMS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const parcelService = {
  getAll: (page?: number, limit?: number) =>
    parcelRepository.findAll(page, limit),

  getById: async (id: number) => {
    const parcel = await parcelRepository.findById(id);
    if (!parcel) throw new CustomError(404, 'Parcel not found');
    return parcel;
  },

  create: async (data: CreateParcelDto) => {
    const trackingNumber = generateTrackingNumber();
    const parcel = await parcelRepository.create({ ...data, trackingNumber });
    await parcelRepository.addTrack(
      parcel.id,
      'PENDING',
      'Parcel registered at origin branch',
    );
    return parcel;
  },

  updateStatus: async (id: number, data: UpdateParcelDto) => {
    const parcel = await parcelRepository.findById(id);
    if (!parcel) throw new CustomError(404, 'Parcel not found');
    if (data.status) {
      await parcelRepository.updateStatus(id, data.status);
      await parcelRepository.addTrack(id, data.status, data.note, data.location);
    }
    return parcelRepository.findById(id);
  },

  delete: async (id: number) => {
    const parcel = await parcelRepository.findById(id);
    if (!parcel) throw new CustomError(404, 'Parcel not found');
    return parcelRepository.delete(id);
  },

  getRecent: (limit?: number) => parcelRepository.recent(limit),

  count: () => parcelRepository.count(),
  countByStatus: (status: Parameters<typeof parcelRepository.countByStatus>[0]) =>
    parcelRepository.countByStatus(status),
};
