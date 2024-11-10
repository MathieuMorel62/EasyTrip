/* eslint-disable no-undef */
import 'dotenv/config';
import mysql from 'mysql2';
import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Tests pour le module de base de données.
 * Ces tests vérifient la connexion à la base de données et le comportement des requêtes.
 */

const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockConnection = {
  connect: mockConnect,
  query: mockQuery,
};

// Mock du module mysql2 pour simuler la connexion et les requêtes
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => mockConnection)
}));


describe('Tests de connexion et de requêtes de la base de données', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simule une connexion réussie
    mockConnect.mockImplementation(cb => cb(null));
    // Simule une requête réussie retournant un tableau vide
    mockQuery.mockImplementation((sql, params, cb) => cb(null, []));
  });


  test('doit établir une connexion à la base de données avec les bonnes configurations', () => {
    jest.isolateModules(() => {
      require('../db');
      // Vérifie que la méthode createConnection a été appelée avec les bonnes informations 
      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      // Vérifie que la méthode connect a été appelée
      expect(mockConnect).toHaveBeenCalled();
    });
  });


  test('doit lancer une erreur lors d\'une connexion échouée', () => {
    // Simule une erreur de connexion
    mockConnect.mockImplementation(cb => cb(new Error('Erreur de connexion')));

    // Vérifie que l'erreur est lancée
    expect(() => {
      jest.isolateModules(() => {
        require('../db');
      });
    }).toThrow('Erreur de connexion');
  });


  test('doit exécuter une requête et retourner les résultats attendus', (done) => {
    const mockResult = [{ id: 1, name: 'Test' }];
    // Simule une requête réussie retournant des résultats
    mockQuery.mockImplementation((sql, params, cb) => cb(null, mockResult));

    // Vérifie que la requête a été exécutée avec les bons paramètres
    jest.isolateModules(() => {
      const db = require('../db').default;
      db.query('SELECT * FROM test', [], (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(mockResult);
        done();
      });
    });
  });


  test('doit gérer les erreurs lors de l\'exécution d\'une requête', (done) => {
    const mockError = new Error('Erreur de requête');
    // Simule une erreur lors de l'exécution de la requête
    mockQuery.mockImplementation((sql, params, cb) => cb(mockError));

    // Vérifie que l'erreur est lancée
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
