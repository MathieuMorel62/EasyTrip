import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock des middlewares et contrôleurs avant l'import des routes
jest.mock('../../middleware/authMiddleware', () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

jest.mock('../../controllers/tripsController', () => ({
  createTrip: jest.fn(),
  getTrips: jest.fn(),
  getTripById: jest.fn(),
  deleteTripById: jest.fn(),
}));

// Mock d'express avec le routeur
const mockRouter = {
  post: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

// Mock d'express
jest.mock('express', () => ({
  Router: jest.fn(() => mockRouter)
}));

// Import après les mocks
import { verifyToken } from '../../middleware/authMiddleware';
import { createTrip, getTrips, getTripById, deleteTripById } from '../../controllers/tripsController';

/**
 * Suite de tests pour les routes des voyages.
 * Ces tests vérifient que les routes sont correctement configurées
 * et que les middlewares et contrôleurs sont appelés avec les bons paramètres.
 */
describe('routes des voyages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Forcer le rechargement du module pour déclencher la configuration des routes
    jest.isolateModules(() => {
      require('../tripsRoutes');
    });
  });


  /**
   * Test pour vérifier que les routes sont correctement définies
   * et que les middlewares sont appliqués comme prévu.
   */
  it('devrait créer une instance de routeur', () => {
    // Vérifie que la route POST pour créer un voyage utilise le middleware de vérification du token et le contrôleur approprié
    expect(mockRouter.post).toHaveBeenCalledWith('/', verifyToken, createTrip);
    
    // Vérifie que la route GET pour récupérer tous les voyages utilise le middleware de vérification du token et le contrôleur approprié
    expect(mockRouter.get).toHaveBeenCalledWith('/', verifyToken, getTrips);
    
    // Vérifie que la route GET pour récupérer un voyage par ID utilise le middleware de vérification du token et le contrôleur approprié
    expect(mockRouter.get).toHaveBeenCalledWith('/:tripId', verifyToken, getTripById);
    
    // Vérifie que la route DELETE pour supprimer un voyage par ID utilise le middleware de vérification du token et le contrôleur approprié
    expect(mockRouter.delete).toHaveBeenCalledWith('/:tripId', verifyToken, deleteTripById);
  });
});
