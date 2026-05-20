import { z } from 'zod';

const vehicleEnum = z.enum(['MOTORCYCLE', 'VAN', 'TRUCK']);

export const createRouteSchema = z.object({
  vehicleType: vehicleEnum,
  startLocation: z.string().min(1, 'Start location required'),
  endLocation: z.string().min(1, 'End location required'),
});

export const optimizeRouteSchema = z.object({
  routeId: z.coerce.number().int().positive(),
  points: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .min(2, 'At least 2 delivery points required'),
});

export type CreateRouteDto = z.infer<typeof createRouteSchema>;
export type OptimizeRouteDto = z.infer<typeof optimizeRouteSchema>;
