/**
 * Ce fichier contient des tests unitaires pour le contrôleur de voyages.
 * Les tests vérifient le bon fonctionnement des fonctions de création, récupération et suppression de voyages.
 * Chaque bloc de tests est organisé par fonction et couvre les cas de succès ainsi que les erreurs potentielles.
*/

import { jest } from '@jest/globals';

const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockConnection = {
  connect: mockConnect,
  query: mockQuery,
};

jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => mockConnection)
}));

jest.mock('../../config/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn((query, values, callback) => callback(null, []))
  }
}));

jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';
import db from '../../config/db.js';  // Import du mock
import { createTrip, getTrips, getTripById, deleteTripById } from '../tripsController.js';
import { describe, it, expect, beforeEach } from '@jest/globals';


describe('Tests pour le contrôleur de voyages', () => {
  let req, res;
  // Réinitialise les mocks avant chaque test
  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123' },
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });


  describe('Tests pour la création d\'un voyage', () => {
    it('devrait créer un voyage avec succès et retourner un message de confirmation', () => {
      const mockTripId = 'trip123';
      uuidv4.mockReturnValue(mockTripId);
      // Données de test
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [],
        hotels: []
      };
      // Mock de la fonction query
      db.query.mockImplementation((query, values, callback) => {
        callback(null);
      });

      // Appelle la fonction à tester
      createTrip(req, res);

      // Vérifie que la fonction query a été appelée
      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Voyage, localisation, itinéraire et hôtels créés avec succès',
        tripId: mockTripId
      }));
    });


    it('devrait retourner une erreur 500 si une erreur de base de données se produit lors de la création', () => {
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [],
        hotels: []
      };

      // Mock de la fonction query
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création du voyage' });
    });


    it('devrait retourner une erreur 500 si une erreur de localisation se produit lors de la création', () => {
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [],
        hotels: []
      };

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null);
      }).mockImplementationOnce((query, values, callback) => {
        callback(new Error('Erreur de localisation'));
      });

      createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création de la localisation' });
    });


    it('devrait retourner une erreur 500 si une erreur d\'itinéraire se produit lors de la création', () => {
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [{ day: 1, plan: [{ placeName: 'Tour Eiffel', placeDetails: 'Détails', geoCoordinates: '48.8584, 2.2945', ticketPricing: '20', timeTravel: '30', time: '10:00' }] }],
        hotels: []
      };

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null);
      }).mockImplementationOnce((query, values, callback) => {
        callback(null);
      }).mockImplementationOnce((query, values, callback) => {
        callback(new Error('Erreur d\'itinéraire'));
      });

      createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création de l\'itinéraire' });
    });
  });


  describe('Tests pour la récupération des voyages', () => {
    it('devrait retourner la liste des voyages avec succès', () => {
      const mockTrips = [{ id: 'trip1' }, { id: 'trip2' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockTrips);
      });

      // Appelle la fonction à tester
      getTrips(req, res);

      // Vérifie que la fonction query a été appelée
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTrips);
    });


    it('devrait retourner une erreur 500 si une erreur de base de données se produit lors de la récupération', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      getTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération des voyages' });
    });


    it('devrait retourner un tableau vide si aucun voyage n\'est trouvé', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });

      getTrips(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });


  describe('Tests pour la récupération d\'un voyage par ID', () => {
    it('devrait retourner un voyage existant avec succès', () => {
      const mockTrip = {
        id: 'trip123',
        userId: 'user123',
        budget: 1000,
        nbOfDays: 5,
        traveler: 2,
        location: 'Paris',
        locations: {},
        itinerary: [],
        hotels: []
      };

      db.query.mockImplementation((query, values, callback) => {
        callback(null, [mockTrip]);
      });

      req.params.tripId = 'trip123';

      getTripById(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockTrip));
    });


    it('devrait retourner une erreur 404 si le voyage n\'est pas trouvé', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });

      req.params.tripId = 'nonexistent';

      getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Voyage non trouvé' });
    });


    it('devrait retourner une erreur 500 si une erreur de base de données se produit lors de la récupération', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      req.params.tripId = 'trip123';

      getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération du voyage' });
    });
  });


  describe('Tests pour la suppression d\'un voyage par ID', () => {
    it('devrait supprimer un voyage avec succès', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      req.params.tripId = 'trip123';

      deleteTripById(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Voyage supprimé avec succès' });
    });


    it('devrait retourner une erreur 404 si le voyage à supprimer n\'est pas trouvé', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 0 });
      });

      req.params.tripId = 'nonexistent';

      deleteTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Voyage non trouvé' });
    });


    it('devrait retourner une erreur 500 si une erreur de base de données se produit lors de la suppression', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      req.params.tripId = 'trip123';

      deleteTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la suppression du voyage' });
    });
  });
});
