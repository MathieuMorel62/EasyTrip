import { createTrip, getTrips, getTripById, deleteTripById } from '../tripsController.js';
import db from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';


jest.mock('../../config/db.js');
jest.mock('uuid');

describe('Contrôleur de voyages', () => {
  let req, res;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    it('devrait créer un nouveau voyage avec succès', () => {
      const mockTripId = 'trip123';
      uuidv4.mockReturnValue(mockTripId);
      
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [],
        hotels: []
      };

      // Simule le succès pour toutes les requêtes
      db.query.mockImplementation((query, values, callback) => {
        callback(null);
      });

      createTrip(req, res);

      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Voyage, localisation, itinéraire et hôtels créés avec succès',
        tripId: mockTripId
      }));
    });

    it('devrait gérer les erreurs lors de la création du voyage', () => {
      // Ajoute un corps de requête valide
      req.body = {
        budget: 1000,
        location: { name: 'Paris' },
        nbOfDays: 5,
        traveler: 2,
        itinerary: [],
        hotels: []
      };

      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création du voyage' });
    });

    it('devrait gérer les erreurs lors de la création de la localisation', () => {
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

    it('devrait gérer les erreurs lors de la création de l\'itinéraire', () => {
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

  describe('getTrips', () => {
    it('devrait récupérer tous les voyages d\'un utilisateur', () => {
      const mockTrips = [{ id: 'trip1' }, { id: 'trip2' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockTrips);
      });

      getTrips(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTrips);
    });

    it('devrait gérer les erreurs lors de la récupération des voyages', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      getTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération des voyages' });
    });

    it('devrait retourner un tableau vide si l\'utilisateur n\'a pas de voyages', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });

      getTrips(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getTripById', () => {
    it('devrait récupérer un voyage spécifique par ID', () => {
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

    it('devrait gérer les erreurs de base de données lors de la récupération d\'un voyage', () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Erreur de base de données'));
      });

      req.params.tripId = 'trip123';

      getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération du voyage' });
    });
  });

  describe('deleteTripById', () => {
    it('devrait supprimer un voyage spécifique par ID', () => {
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

    it('devrait gérer les erreurs de base de données lors de la suppression d\'un voyage', () => {
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
