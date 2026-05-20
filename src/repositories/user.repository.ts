import prisma from '../config/prisma.config.js';
import type { CreateUserDto, UpdateUserDto } from '../types/index.js';

export const userRepository = {
  findAll: () =>
    prisma.user.findMany({
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.user.findUnique({ where: { id }, include: { branch: true } }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: CreateUserDto & { password: string }) =>
    prisma.user.create({ data }),

  update: (id: number, data: UpdateUserDto) =>
    prisma.user.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.user.delete({ where: { id } }),

  count: () => prisma.user.count(),
};
