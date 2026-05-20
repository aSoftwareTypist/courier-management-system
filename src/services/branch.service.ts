import { branchRepository } from '../repositories/branch.repository.js';
import CustomError from '../utils/CustomError.js';
import type { CreateBranchDto, UpdateBranchDto } from '../types/index.js';

export const branchService = {
  getAll: () => branchRepository.findAll(),

  getById: async (id: number) => {
    const branch = await branchRepository.findById(id);
    if (!branch) throw new CustomError(404, 'Branch not found');
    return branch;
  },

  create: async (data: CreateBranchDto) => {
    const existing = await branchRepository.findByCode(data.branchCode);
    if (existing) throw new CustomError(409, 'Branch code already exists');
    return branchRepository.create(data);
  },

  update: async (id: number, data: UpdateBranchDto) => {
    const branch = await branchRepository.findById(id);
    if (!branch) throw new CustomError(404, 'Branch not found');
    return branchRepository.update(id, data);
  },

  delete: async (id: number) => {
    const branch = await branchRepository.findById(id);
    if (!branch) throw new CustomError(404, 'Branch not found');
    return branchRepository.delete(id);
  },

  count: () => branchRepository.count(),
};
