import { Router } from 'express';
import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../controllers/branch.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listBranches);
router.post('/', roleMiddleware('ADMIN'), createBranch);
router.post('/:id/edit', roleMiddleware('ADMIN'), updateBranch);
router.post('/:id/delete', roleMiddleware('ADMIN'), deleteBranch);

export default router;
