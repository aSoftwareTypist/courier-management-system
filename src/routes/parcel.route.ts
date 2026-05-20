import { Router } from 'express';
import {
  listParcels,
  createParcel,
  updateParcel,
  deleteParcel,
} from '../controllers/parcel.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listParcels);
router.post('/', createParcel);
router.post('/:id/status', updateParcel);
router.post('/:id/delete', deleteParcel);

export default router;
