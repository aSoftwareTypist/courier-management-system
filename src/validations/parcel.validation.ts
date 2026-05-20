import { z } from 'zod';

const statusEnum = z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']);

export const createParcelSchema = z.object({
  senderName: z.string().min(1, 'Sender name required'),
  senderPhone: z.string().min(1, 'Sender phone required'),
  senderAddress: z.string().min(1, 'Sender address required'),
  receiverName: z.string().min(1, 'Receiver name required'),
  receiverPhone: z.string().min(1, 'Receiver phone required'),
  receiverAddress: z.string().min(1, 'Receiver address required'),
  weight: z.coerce.number().positive().optional(),
  fromBranchId: z.coerce.number().int().positive('Origin branch required'),
  toBranchId: z.coerce.number().int().positive('Destination branch required'),
});

export const updateParcelSchema = z.object({
  status: statusEnum,
  note: z.string().optional(),
  location: z.string().optional(),
});

export type CreateParcelDto = z.infer<typeof createParcelSchema>;
export type UpdateParcelDto = z.infer<typeof updateParcelSchema>;
