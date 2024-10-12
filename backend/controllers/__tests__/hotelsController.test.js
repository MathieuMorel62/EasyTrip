import { createHotels } from '../hotelsController.js';
import db from '../../config/db.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';


jest.mock('../../config/db.js');

describe('hotelsController', () => {
  describe('createHotels', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('devrait appeler le callback sans erreur si aucun hôtel n\'est fourni', (done) => {
      createHotels('trip123', [], (err) => {
        expect(err).toBeNull();
        expect(db.query).not.toHaveBeenCalled();
        done();
      });
    });

    it('devrait insérer correctement les hôtels dans la base de données', (done) => {
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
        callback(null);
      });

      createHotels('trip123', mockHotels, (err) => {
        expect(err).toBeNull();
        expect(db.query).toHaveBeenCalledTimes(1);
        expect(db.query.mock.calls[0][0]).toContain('INSERT INTO hotels');
        expect(db.query.mock.calls[0][1]).toEqual([
          'trip123',
          'Hôtel Test',
          '123 Rue de Test',
          100,
          '{"lat":48.8566,"lng":2.3522}',
          4.5,
          'Un hôtel de test'
        ]);
        done();
      });
    });

    it('devrait gérer les erreurs de base de données', (done) => {
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
        callback(mockError);
      });

      createHotels('trip123', mockHotels, (err) => {
        expect(err).toBe(mockError);
        expect(db.query).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('devrait insérer plusieurs hôtels correctement', (done) => {
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
        callback(null);
      });

      createHotels('trip123', mockHotels, (err) => {
        expect(err).toBeNull();
        expect(db.query).toHaveBeenCalledTimes(2);
        expect(db.query.mock.calls[0][1]).toEqual([
          'trip123',
          'Hôtel Test 1',
          '123 Rue de Test',
          100,
          '{"lat":48.8566,"lng":2.3522}',
          4.5,
          'Premier hôtel de test'
        ]);
        expect(db.query.mock.calls[1][1]).toEqual([
          'trip123',
          'Hôtel Test 2',
          '456 Avenue de Test',
          150,
          '{"lat":48.8584,"lng":2.2945}',
          4,
          'Deuxième hôtel de test'
        ]);
        done();
      });
    });
  });
});
