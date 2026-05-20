import { z } from 'zod';

export const createBranchSchema = z.object({
  branchCode: z.string().min(2, 'Branch code required').toUpperCase(),
  street: z.string().min(1, 'Street required'),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  zipCode: z.string().min(1, 'ZIP code required'),
  country: z.string().min(1, 'Country required'),
  contact: z.string().min(1, 'Contact required'),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

export type CreateBranchDto = z.infer<typeof createBranchSchema>;
export type UpdateBranchDto = z.infer<typeof updateBranchSchema>;
