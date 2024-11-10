/**
 * Tests pour le contrôleur de localisation, en particulier la fonction createLocation.
 * Ces tests vérifient le comportement de la fonction lors de l'insertion d'une nouvelle localisation
 * dans la base de données, en gérant à la fois les cas de succès et d'erreur.
 */

/* eslint-disable no-undef */
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((cb) => cb(null)),
    query: jest.fn((sql, params, cb) => cb(null, [])),
    end: jest.fn(),
  })),
}));


import { createLocation } from '../locationsController.js';
import db from '../../config/db.js';
import { describe, it, expect, beforeEach } from '@jest/globals';


jest.mock('../../config/db.js');


describe('createLocation', () => {
  beforeEach(() => {
    // Réinitialise tous les mocks avant chaque test pour éviter les interférences entre les tests
    jest.clearAllMocks();
  });

  it('devrait insérer une nouvelle localisation avec succès', (done) => {
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

    // Simulation de l'implémentation de la méthode db.query pour vérifier les valeurs insérées
    db.query.mockImplementation((query, values, callback) => {
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
      // Simule le succès de l'insertion avec un nouvel ID de localisation
      callback(null, { insertId: 'newLocationId' });
    });
    // Appel de la fonction createLocation et vérification des résultats
    createLocation(tripId, location, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ insertId: 'newLocationId' });
      expect(db.query).toHaveBeenCalledTimes(1);
      done();
    });
  });


  it('devrait gérer les erreurs de base de données lors de l\'insertion', (done) => {
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

    const dbError = new Error('Erreur de base de données');
    // Simulation de l'implémentation de la méthode db.query pour simuler une erreur
    db.query.mockImplementation((query, values, callback) => {
      callback(dbError, null);
    });

    // Appel de la fonction createLocation et vérification des résultats en cas d'erreur
    createLocation(tripId, location, (err, result) => {
      expect(err).toBe(dbError);
      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
