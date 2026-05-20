import { Router } from 'express';
import { showTracking, searchTracking } from '../controllers/tracking.controller.js';

const router = Router();

router.get('/tracking', showTracking);
router.post('/tracking', searchTracking);

export default router;
