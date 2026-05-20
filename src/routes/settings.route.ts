import { Router } from 'express';
import { showSettings, updateSettings } from '../controllers/settings.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/settings', showSettings);
router.post('/settings', updateSettings);

export default router;
