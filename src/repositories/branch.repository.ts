import prisma from '../config/prisma.config.js';
import type { CreateBranchDto, UpdateBranchDto } from '../types/index.js';

export const branchRepository = {
  findAll: () =>
    prisma.branch.findMany({
      include: { _count: { select: { users: true, fromParcels: true } } },
      orderBy: { branchCode: 'asc' },
    }),

  findById: (id: number) =>
    prisma.branch.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    }),

  findByCode: (branchCode: string) =>
    prisma.branch.findUnique({ where: { branchCode } }),

  findAllWithCoords: () =>
    prisma.branch.findMany({
      where: { latitude: { not: null }, longitude: { not: null } },
    }),

  create: (data: CreateBranchDto) =>
    prisma.branch.create({ data }),

  update: (id: number, data: UpdateBranchDto) =>
    prisma.branch.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.branch.delete({ where: { id } }),

  count: () => prisma.branch.count(),
};
