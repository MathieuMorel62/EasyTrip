/**
 * Tests pour le contrôleur d'itinéraires.
 * Ces tests vérifient le comportement de la fonction createItinerary,
 * en s'assurant qu'elle gère correctement les cas d'itinéraires valides,
 * vides et les erreurs de base de données.
 */

/* eslint-disable no-undef */
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((cb) => cb(null)),
    query: jest.fn((sql, params, cb) => cb(null, [])),
    end: jest.fn(),
  })),
}));

import { createItinerary } from '../itineraryController.js';
import db from '../../config/db.js';
import { describe, test, expect, beforeEach } from '@jest/globals';


jest.mock('../../config/db.js');


describe('Tests de la fonction createItinerary', () => {
  beforeEach(() => {
    // Réinitialise les mocks avant chaque test pour éviter les interférences
    jest.clearAllMocks();
  });


  test('devrait créer un itinéraire avec des données valides', (done) => {
    // Définit un identifiant de voyage valide
    const mockTripId = 'trip123';
    // Définit un itinéraire valide
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
    // Simule la réponse de la base de données pour un itinéraire valide
    db.query.mockImplementation((query, values, callback) => {
      callback(null);
    });
    // Appelle la fonction createItinerary avec les données valides
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


  test('ne devrait pas créer d\'itinéraire si le tableau est vide', (done) => {
    const mockTripId = 'trip123';
    const mockItinerary = [];

    // Appelle la fonction createItinerary avec un tableau vide
    createItinerary(mockTripId, mockItinerary, (err) => {
      expect(err).toBeNull();
       // Vérifie qu'aucune requête n'est envoyée
      expect(db.query).not.toHaveBeenCalled();
      done();
    });
  });


  test('devrait gérer les erreurs de base de données lors de la création d\'un itinéraire', (done) => {
    // Définit un identifiant de voyage valide
    const mockTripId = 'trip123';
    // Définit un itinéraire valide
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
    // Définit une erreur de base de données
    const mockError = new Error('Erreur de base de données');
    // Simule une erreur de base de données
    db.query.mockImplementation((query, values, callback) => {
      callback(mockError);
    });
    // Appelle la fonction createItinerary avec les données valides et l'erreur de base de données
    createItinerary(mockTripId, mockItinerary, (err) => {
       // Vérifie que l'erreur est correctement renvoyée
      expect(err).toBe(mockError);
      expect(db.query).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
