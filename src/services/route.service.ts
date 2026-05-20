import { routeRepository } from '../repositories/route.repository.js';
import CustomError from '../utils/CustomError.js';
import type { CreateRouteDto, DeliveryPoint } from '../types/index.js';

// ── Haversine Formula ─────────────────────────────────────────────────────────
const haversineDistanceKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Nearest Neighbour TSP ─────────────────────────────────────────────────────
export const nearestNeighborRoute = (
  points: DeliveryPoint[],
): {
  ordered: DeliveryPoint[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
} => {
  if (points.length === 0)
    return { ordered: [], totalDistanceKm: 0, estimatedTimeMin: 0 };

  const unvisited = [...points];
  const ordered: DeliveryPoint[] = [unvisited.splice(0, 1)[0]!];
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    const current = ordered[ordered.length - 1]!;
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const p = unvisited[i]!;
      const d = haversineDistanceKm(current.lat, current.lng, p.lat, p.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    totalDistanceKm += nearestDist;
    ordered.push(unvisited.splice(nearestIdx, 1)[0]!);
  }

  const estimatedTimeMin = Math.round((totalDistanceKm / 60) * 60); // 60 km/h avg

  return { ordered, totalDistanceKm, estimatedTimeMin };
};

// ── Service ───────────────────────────────────────────────────────────────────
export const routeService = {
  getAll: () => routeRepository.findAll(),

  getById: async (id: number) => {
    const route = await routeRepository.findById(id);
    if (!route) throw new CustomError(404, 'Route not found');
    return route;
  },

  create: async (data: CreateRouteDto) => routeRepository.create(data),

  optimize: async (id: number, points: DeliveryPoint[]) => {
    const route = await routeRepository.findById(id);
    if (!route) throw new CustomError(404, 'Route not found');

    const { ordered, totalDistanceKm, estimatedTimeMin } =
      nearestNeighborRoute(points);

    return routeRepository.update(id, {
      waypoints: ordered,
      distance: Math.round(totalDistanceKm * 10) / 10,
      estimatedTime: estimatedTimeMin,
    });
  },

  delete: async (id: number) => {
    const route = await routeRepository.findById(id);
    if (!route) throw new CustomError(404, 'Route not found');
    return routeRepository.delete(id);
  },

  count: () => routeRepository.count(),
};
