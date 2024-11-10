/**
 * Tests pour la connexion à la base de données et les requêtes SQL.
 * Ces tests vérifient que la connexion à la base de données fonctionne correctement,
 * ainsi que le traitement des requêtes et des erreurs.
 */

import 'dotenv/config';
import mysql from 'mysql2';
import { describe, test, expect, beforeEach } from '@jest/globals';

/* eslint-disable no-undef */
const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockConnection = {
  connect: mockConnect,
  query: mockQuery,
};


jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => mockConnection)
}));


describe('Tests de la connexion et des requêtes de la base de données', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simule une connexion réussie à la base de données
    mockConnect.mockImplementation(cb => cb(null));
    // Simule une requête SQL réussie
    mockQuery.mockImplementation((sql, params, cb) => cb(null, []));
  });


  test('doit établir une connexion à la base de données avec les bonnes informations', () => {
    jest.isolateModules(() => {
      require('../db');
      // Vérifie que la connexion à la base de données a été établie avec les bonnes informations
      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      // Vérifie que la fonction connect a été appelée
      expect(mockConnect).toHaveBeenCalled();
    });
  });


  test('doit lancer une erreur si la connexion échoue', () => {
    // Simule une erreur de connexion
    mockConnect.mockImplementation(cb => cb(new Error('Erreur de connexion')));
    // Vérifie que l'erreur de connexion est levée
    expect(() => {
      jest.isolateModules(() => {
        require('../db');
      });
    }).toThrow('Erreur de connexion');
  });


  test('doit exécuter une requête SQL et retourner les résultats', (done) => {
    const mockResult = [{ id: 1, name: 'Test' }];
    // Simule une requête SQL réussie avec des résultats
    mockQuery.mockImplementation((sql, params, cb) => cb(null, mockResult));
    // Isolation du module pour éviter les interférences entre les tests
    jest.isolateModules(() => {
      const db = require('../db').default;
      db.query('SELECT * FROM test', [], (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(mockResult);
        done();
      });
    });
  });


  test('doit gérer les erreurs lors de l\'exécution d\'une requête SQL', (done) => {
    const mockError = new Error('Erreur de requête');
    // Simule une erreur lors de l'exécution de la requête
    mockQuery.mockImplementation((sql, params, cb) => cb(mockError));
    // Isolation du module pour éviter les interférences entre les tests
    jest.isolateModules(() => {
      const db = require('../db').default;
      db.query('SELECT * FROM test', [], (err, result) => {
        expect(err).toBe(mockError);
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
