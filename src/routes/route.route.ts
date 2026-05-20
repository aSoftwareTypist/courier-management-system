import { Router } from 'express';
import {
  listRoutes,
  createRoute,
  optimizeRoute,
  deleteRoute,
} from '../controllers/route.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listRoutes);
router.post('/', createRoute);
router.post('/optimize', optimizeRoute);
router.post('/:id/delete', deleteRoute);

export default router;
