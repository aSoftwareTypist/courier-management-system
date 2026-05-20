import { parcelRepository } from '../repositories/parcel.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { branchRepository } from '../repositories/branch.repository.js';
import { routeRepository } from '../repositories/route.repository.js';

export const dashboardService = {
  getStats: async () => {
    const [totalParcels, pending, inTransit, delivered, totalUsers, totalBranches, totalRoutes] =
      await Promise.all([
        parcelRepository.count(),
        parcelRepository.countByStatus('PENDING'),
        parcelRepository.countByStatus('IN_TRANSIT'),
        parcelRepository.countByStatus('DELIVERED'),
        userRepository.count(),
        branchRepository.count(),
        routeRepository.count(),
      ]);

    return {
      totalParcels,
      pending,
      inTransit,
      delivered,
      totalUsers,
      totalBranches,
      totalRoutes,
    };
  },

  getRecentParcels: (limit = 8) => parcelRepository.recent(limit),
};
