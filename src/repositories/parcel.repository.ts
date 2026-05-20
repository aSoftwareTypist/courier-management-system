import prisma from '../config/prisma.config.js';
import type { CreateParcelDto, ParcelStatus } from '../types/index.js';

export const parcelRepository = {
  findAll: (page = 1, limit = 20) =>
    prisma.parcel.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        fromBranch: true,
        toBranch: true,
        tracks: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.parcel.findUnique({
      where: { id },
      include: {
        fromBranch: true,
        toBranch: true,
        tracks: { orderBy: { createdAt: 'asc' } },
      },
    }),

  findByTrackingNumber: (trackingNumber: string) =>
    prisma.parcel.findUnique({
      where: { trackingNumber },
      include: {
        fromBranch: true,
        toBranch: true,
        tracks: { orderBy: { createdAt: 'asc' } },
      },
    }),

  create: (data: CreateParcelDto & { trackingNumber: string }) =>
    prisma.parcel.create({ data }),

  updateStatus: (id: number, status: ParcelStatus) =>
    prisma.parcel.update({ where: { id }, data: { status } }),

  delete: (id: number) =>
    prisma.parcel.delete({ where: { id } }),

  count: () => prisma.parcel.count(),

  countByStatus: (status: ParcelStatus) =>
    prisma.parcel.count({ where: { status } }),

  addTrack: (
    parcelId: number,
    status: ParcelStatus,
    note?: string,
    location?: string,
  ) =>
    prisma.parcelTrack.create({ data: { parcelId, status, note, location } }),

  recent: (limit = 10) =>
    prisma.parcel.findMany({
      take: limit,
      include: { fromBranch: true, toBranch: true },
      orderBy: { createdAt: 'desc' },
    }),
};
