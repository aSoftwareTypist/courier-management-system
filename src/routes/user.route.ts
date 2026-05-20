import { Router } from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/', listUsers);
router.post('/', createUser);
router.post('/:id/edit', updateUser);
router.post('/:id/delete', deleteUser);

export default router;
