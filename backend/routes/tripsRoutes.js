import express from 'express';
import { createTrip, getTrips, getTripById } from '../controllers/tripsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTrip);
router.get('/', verifyToken, getTrips);
router.get('/:tripId', verifyToken, getTripById);

export default router;
