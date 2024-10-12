import { createItinerary } from '../itineraryController.js';
import db from '../../config/db.js';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock de la connexion à la base de données
jest.mock('../../config/db.js');

describe('Itinerary Controller', () => {
  beforeEach(() => {
    // Réinitialise les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('createItinerary devrait insérer correctement les données d\'itinéraire', (done) => {
    const mockTripId = 'trip123';
    const mockItinerary = [
      {
        day: 1,
        plan: [
          {
            placeName: 'Tour Eiffel',
            placeDetails: 'Monument emblématique de Paris',
            geoCoordinates: { lat: 48.8584, lng: 2.2945 },
            ticketPricing: '26 EUR',
            timeTravel: '30 min',
            time: '10:00'
          }
        ]
      }
    ];

    // Mock de la fonction db.query pour simuler une insertion réussie
    db.query.mockImplementation((query, values, callback) => {
      callback(null);
    });

    createItinerary(mockTripId, mockItinerary, (err) => {
      expect(err).toBeNull();
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query.mock.calls[0][0]).toContain('INSERT INTO itinerary');
      expect(db.query.mock.calls[0][1]).toEqual([
        'trip123',
        1,
        'Tour Eiffel',
        'Monument emblématique de Paris',
        '{"lat":48.8584,"lng":2.2945}',
        '26 EUR',
        '30 min',
        '10:00'
      ]);
      done();
    });
  });

  test('createItinerary ne devrait pas insérer de données si l\'itinéraire est vide', (done) => {
    const mockTripId = 'trip123';
    const mockItinerary = [];

    createItinerary(mockTripId, mockItinerary, (err) => {
      expect(err).toBeNull();
      expect(db.query).not.toHaveBeenCalled();
      done();
    });
  });

  test('createItinerary devrait gérer les erreurs de base de données', (done) => {
    const mockTripId = 'trip123';
    const mockItinerary = [
      {
        day: 1,
        plan: [
          {
            placeName: 'Louvre',
            placeDetails: 'Musée d\'art',
            geoCoordinates: { lat: 48.8606, lng: 2.3376 },
            ticketPricing: '17 EUR',
            timeTravel: '20 min',
            time: '14:00'
          }
        ]
      }
    ];

    // Mock de la fonction db.query pour simuler une erreur de base de données
    const mockError = new Error('Erreur de base de données');
    db.query.mockImplementation((query, values, callback) => {
      callback(mockError);
    });

    createItinerary(mockTripId, mockItinerary, (err) => {
      expect(err).toBe(mockError);
      expect(db.query).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
