import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import CustomError from '../utils/CustomError.js';
import type { SessionUser } from '../types/index.js';

export const authService = {
  login: async (email: string, password: string): Promise<SessionUser> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new CustomError(401, 'Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new CustomError(401, 'Invalid email or password');

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role as SessionUser['role'],
      branchId: user.branchId,
    };
  },
};
