/**
 * Suite de tests pour les fonctions liées aux utilisateurs.
 * Ces tests vérifient la création d'utilisateurs, la recherche par email,
 * et la création d'utilisateurs via Google.
 */

/* eslint-disable no-undef */
// Simulation de la connexion à la base de données MySQL pour les tests
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

import { createUser, findUserByEmail, createGoogleUser } from '../User';
import db from '../../config/db.js';
import { describe, beforeEach, test, expect } from '@jest/globals';

// Simulation de la configuration de la base de données pour les tests
jest.mock('../../config/db.js');


describe('Tests des fonctions utilisateur', () => {
  
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test pour éviter les interférences
    jest.clearAllMocks();
  });

  test('doit créer un nouvel utilisateur avec des informations valides', (done) => {
    const email = 'test@example.com';
    const hashedPassword = 'hashedPassword';
    const firstName = 'John';
    const lastName = 'Doe';

    // Simulation de la réponse de la base de données pour l'insertion d'un utilisateur
    db.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    createUser(email, hashedPassword, firstName, lastName, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [email, hashedPassword, firstName, lastName],
        expect.any(Function)
      );
      done();
    });
  });


  test('doit trouver un utilisateur par email', (done) => {
    const email = 'test@example.com';
    const user = { id: '123', email, firstName: 'John', lastName: 'Doe' };

    // Simulation de la réponse de la base de données pour la recherche d'un utilisateur
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [user]);
    });
    // Appelle la fonction à tester
    findUserByEmail(email, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([user]);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = ?'),
        [email],
        expect.any(Function)
      );
      done();
    });
  });


  test('doit créer un nouvel utilisateur Google et récupérer son ID', (done) => {
    const email = 'googleuser@example.com';
    const fullName = 'Jane Doe';
    const hashedPassword = '';

    // Simulation de la réponse de la base de données pour l'insertion et la recherche d'un utilisateur
    db.query.mockImplementation((query, params, callback) => {
      if (query.includes('INSERT INTO users')) {
        callback(null, { affectedRows: 1 });
      } else if (query.includes('SELECT id FROM users WHERE email = ?')) {
        callback(null, [{ id: '456' }]);
      }
    });

    createGoogleUser(email, fullName, hashedPassword, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ userId: '456', result: { affectedRows: 1 } });
      expect(db.query).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
