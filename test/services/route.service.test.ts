import { describe, it, expect } from 'vitest';
import { nearestNeighborRoute } from '../../src/services/route.service.js';
import type { DeliveryPoint } from '../../src/types/index.js';

describe('nearestNeighborRoute optimization algorithm', () => {
  it('should return empty values when points array is empty', () => {
    const result = nearestNeighborRoute([]);
    expect(result.ordered).toEqual([]);
    expect(result.totalDistanceKm).toBe(0);
    expect(result.estimatedTimeMin).toBe(0);
  });

  it('should optimize a list of points starting from the first point using nearest neighbor', () => {
    // Thamel is start hub, Lazimpat is close (~0.8km), Bhaktapur is far (~11km)
    const points: DeliveryPoint[] = [
      { id: 1, name: 'Starting Hub (Thamel)', lat: 27.7172, lng: 85.3240 },
      { id: 2, name: 'Far Point (Bhaktapur)', lat: 27.6710, lng: 85.4298 },
      { id: 3, name: 'Close Point (Lazimpat)', lat: 27.7243, lng: 85.3235 },
    ];

    const result = nearestNeighborRoute(points);

    // Starts at first point
    expect(result.ordered[0]!.id).toBe(1);

    // Closest point (Lazimpat) must be visited first before Bhaktapur
    expect(result.ordered[1]!.id).toBe(3);
    expect(result.ordered[2]!.id).toBe(2);

    expect(result.totalDistanceKm).toBeGreaterThan(0);
    expect(result.estimatedTimeMin).toBeGreaterThan(0);
  });

  it('should calculate accurate distances based on Haversine', () => {
    // KTM to Pokhara is ~146 km
    const points: DeliveryPoint[] = [
      { id: 1, name: 'Kathmandu', lat: 27.7172, lng: 85.3240 },
      { id: 2, name: 'Pokhara', lat: 28.2096, lng: 83.9856 },
    ];

    const result = nearestNeighborRoute(points);
    expect(result.totalDistanceKm).toBeGreaterThan(140);
    expect(result.totalDistanceKm).toBeLessThan(150);
  });
});
