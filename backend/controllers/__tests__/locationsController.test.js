import { createLocation } from '../locationsController.js';
import db from '../../config/db.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock de la connexion à la base de données
jest.mock('../../config/db.js');

describe('Contrôleur de localisation', () => {
  beforeEach(() => {
    // Réinitialise tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('createLocation', () => {
    it('devrait insérer une nouvelle localisation dans la base de données', (done) => {
      // Données de test
      const tripId = 'trip123';
      const location = {
        adminCode1: 'AC1',
        adminName1: 'Admin Name',
        countryCode: 'CC',
        countryName: 'Country Name',
        geonameId: '12345',
        lat: 12.345,
        lng: 67.890,
        population: 1000000
      };

      // Mock de la fonction query de la base de données
      db.query.mockImplementation((query, values, callback) => {
        // Vérifie que la requête SQL est correcte
        expect(query).toBe('INSERT INTO locations (id, tripId, adminCode1, adminName1, countryCode, countryName, geonameId, lat, lng, population) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        // Vérifie que les valeurs sont correctes
        expect(values).toEqual([
          tripId,
          location.adminCode1,
          location.adminName1,
          location.countryCode,
          location.countryName,
          location.geonameId,
          location.lat,
          location.lng,
          location.population
        ]);

        // Simule un succès de l'insertion
        callback(null, { insertId: 'newLocationId' });
      });

      // Appelle la fonction à tester
      createLocation(tripId, location, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({ insertId: 'newLocationId' });
        expect(db.query).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('devrait gérer les erreurs lors de l\'insertion d\'une localisation', (done) => {
      const tripId = 'trip123';
      const location = {
        adminCode1: 'AC1',
        adminName1: 'Admin Name',
        countryCode: 'CC',
        countryName: 'Country Name',
        geonameId: '12345',
        lat: 12.345,
        lng: 67.890,
        population: 1000000
      };

      // Simule une erreur de base de données
      const dbError = new Error('Erreur de base de données');
      db.query.mockImplementation((query, values, callback) => {
        callback(dbError, null);
      });

      createLocation(tripId, location, (err, result) => {
        expect(err).toBe(dbError);
        expect(result).toBeNull();
        expect(db.query).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
