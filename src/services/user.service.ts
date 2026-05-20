import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import CustomError from '../utils/CustomError.js';
import type { CreateUserDto, UpdateUserDto } from '../types/index.js';

export const userService = {
  getAll: () => userRepository.findAll(),

  getById: async (id: number) => {
    const user = await userRepository.findById(id);
    if (!user) throw new CustomError(404, 'User not found');
    return user;
  },

  create: async (data: CreateUserDto) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new CustomError(409, 'Email already in use');
    const hashed = await bcrypt.hash(data.password, 10);
    return userRepository.create({ ...data, password: hashed });
  },

  update: async (id: number, data: UpdateUserDto) => {
    const user = await userRepository.findById(id);
    if (!user) throw new CustomError(404, 'User not found');
    const updateData: UpdateUserDto = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return userRepository.update(id, updateData);
  },

  delete: async (id: number) => {
    const user = await userRepository.findById(id);
    if (!user) throw new CustomError(404, 'User not found');
    return userRepository.delete(id);
  },

  count: () => userRepository.count(),
};
