import prisma from '../config/prisma.config.js';
import type { CreateRouteDto, RouteStatus, VehicleType } from '../types/index.js';

export const routeRepository = {
  findAll: () =>
    prisma.route.findMany({ orderBy: { createdAt: 'desc' } }),

  findById: (id: number) =>
    prisma.route.findUnique({ where: { id } }),

  create: (data: CreateRouteDto & {
    waypoints?: object;
    distance?: number;
    estimatedTime?: number;
  }) =>
    prisma.route.create({ data }),

  update: (
    id: number,
    data: Partial<{
      vehicleType: VehicleType;
      startLocation: string;
      endLocation: string;
      status: RouteStatus;
      waypoints: object;
      distance: number;
      estimatedTime: number;
    }>,
  ) =>
    prisma.route.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.route.delete({ where: { id } }),

  count: () => prisma.route.count(),
};
