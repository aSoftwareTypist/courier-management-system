import prisma from '../config/prisma.config.js';

export const systemSettingRepository = {
  get: () => prisma.systemSetting.findFirst(),

  upsert: (data: {
    name: string;
    email: string;
    contact: string;
    address: string;
  }) =>
    prisma.systemSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    }),
};
