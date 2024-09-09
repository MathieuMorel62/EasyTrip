import express from 'express';
import { createTrip, getTrips, getTripById, deleteTripById } from '../controllers/tripsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTrip);
router.get('/', verifyToken, getTrips);
router.get('/:tripId', verifyToken, getTripById);
router.delete('/:tripId', verifyToken, deleteTripById);

export default router;
