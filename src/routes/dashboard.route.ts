import { Router } from 'express';
import { showDashboard } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/dashboard', authMiddleware, showDashboard);

export default router;
