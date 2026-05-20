import { Router } from 'express';
import authRouter from './auth.route.js';
import dashboardRouter from './dashboard.route.js';
import parcelRouter from './parcel.route.js';
import trackingRouter from './tracking.route.js';
import branchRouter from './branch.route.js';
import userRouter from './user.route.js';
import routeRouter from './route.route.js';
import settingsRouter from './settings.route.js';

const router = Router();

// Root redirect
router.get('/', (_req, res) => res.redirect('/login'));

// Mount routers
router.use('/', authRouter);
router.use('/', dashboardRouter);
router.use('/parcels', parcelRouter);
router.use('/', trackingRouter);
router.use('/branches', branchRouter);
router.use('/users', userRouter);
router.use('/routes', routeRouter);
router.use('/', settingsRouter);

export default router;
