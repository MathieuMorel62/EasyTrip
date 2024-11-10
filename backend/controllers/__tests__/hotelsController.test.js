/**
 * Tests pour le contrôleur des hôtels.
 * Ces tests vérifient le comportement de la fonction createHotels,
 * en s'assurant qu'elle gère correctement les cas de succès et d'erreur.
 */

/* eslint-disable no-undef */
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

import { createHotels } from '../hotelsController.js';
import db from '../../config/db.js';
import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../config/db.js');

describe('Tests pour la fonction createHotels', () => {
  beforeEach(() => {
    // Réinitialise les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('devrait ne pas appeler la base de données si aucun hôtel n\'est fourni', (done) => {
    createHotels('trip123', [], (err) => {
      // Aucune erreur ne doit être renvoyée
      expect(err).toBeNull();
      // La base de données ne doit pas être interrogée
      expect(db.query).not.toHaveBeenCalled();
      done();
    });
  });


  it('devrait insérer un hôtel dans la base de données avec succès', (done) => {
    const mockHotels = [
      {
        hotelName: 'Hôtel Test',
        hotelAddress: '123 Rue de Test',
        price: 100,
        geoCoordinates: { lat: 48.8566, lng: 2.3522 },
        rating: '4.5',
        description: 'Un hôtel de test'
      }
    ];

    db.query.mockImplementation((query, values, callback) => {
       // Simule une réponse réussie de la base de données
      callback(null);
    });

    createHotels('trip123', mockHotels, (err) => {
      // Aucune erreur ne doit être renvoyée
      expect(err).toBeNull();
      // La base de données doit être interrogée une fois
      expect(db.query).toHaveBeenCalledTimes(1);
      // Vérifie que la requête d'insertion est correcte
      expect(db.query.mock.calls[0][0]).toContain('INSERT INTO hotels');
      expect(db.query.mock.calls[0][1]).toEqual([
        'trip123',
        'Hôtel Test',
        '123 Rue de Test',
        100,
        '{"lat":48.8566,"lng":2.3522}',
        4.5,
        'Un hôtel de test'
      ]); // Vérifie que les valeurs insérées sont correctes
      done();
    });
  });


  it('devrait gérer les erreurs de la base de données lors de l\'insertion d\'un hôtel', (done) => {
    const mockHotels = [
      {
        hotelName: 'Hôtel Test',
        hotelAddress: '123 Rue de Test',
        price: 100,
        geoCoordinates: { lat: 48.8566, lng: 2.3522 },
        rating: '4.5',
        description: 'Un hôtel de test'
      }
    ];

    const mockError = new Error('Erreur de base de données');
    db.query.mockImplementation((query, values, callback) => {
      // Simule une erreur de la base de données
      callback(mockError);
    });

    createHotels('trip123', mockHotels, (err) => {
       // L'erreur renvoyée doit correspondre à l'erreur simulée
      expect(err).toBe(mockError);
      // La base de données doit être interrogée une fois
      expect(db.query).toHaveBeenCalledTimes(1);
      done();
    });
  });


  it('devrait insérer plusieurs hôtels dans la base de données avec succès', (done) => {
    const mockHotels = [
      {
        hotelName: 'Hôtel Test 1',
        hotelAddress: '123 Rue de Test',
        price: 100,
        geoCoordinates: { lat: 48.8566, lng: 2.3522 },
        rating: '4.5',
        description: 'Premier hôtel de test'
      },
      {
        hotelName: 'Hôtel Test 2',
        hotelAddress: '456 Avenue de Test',
        price: 150,
        geoCoordinates: { lat: 48.8584, lng: 2.2945 },
        rating: '4.0',
        description: 'Deuxième hôtel de test'
      }
    ];

    db.query.mockImplementation((query, values, callback) => {
      // Simule une réponse réussie de la base de données
      callback(null);
    });

    createHotels('trip123', mockHotels, (err) => {
       // Aucune erreur ne doit être renvoyée
      expect(err).toBeNull();
      // La base de données doit être interrogée deux fois
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][1]).toEqual([
        'trip123',
        'Hôtel Test 1',
        '123 Rue de Test',
        100,
        '{"lat":48.8566,"lng":2.3522}',
        4.5,
        'Premier hôtel de test'
      ]); // Vérifie que les valeurs du premier hôtel sont correctes
      expect(db.query.mock.calls[1][1]).toEqual([
        'trip123',
        'Hôtel Test 2',
        '456 Avenue de Test',
        150,
        '{"lat":48.8584,"lng":2.2945}',
        4,
        'Deuxième hôtel de test'
      ]); // Vérifie que les valeurs du deuxième hôtel sont correctes
      done();
    });
  });
});
