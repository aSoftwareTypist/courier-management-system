import { systemSettingRepository } from '../repositories/systemSetting.repository.js';

export const systemSettingService = {
  get: () => systemSettingRepository.get(),

  upsert: (data: {
    name: string;
    email: string;
    contact: string;
    address: string;
  }) => systemSettingRepository.upsert(data),
};
