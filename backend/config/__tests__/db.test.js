/* eslint-disable no-undef */
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { expect, describe, beforeEach, it } from '@jest/globals';


// Charge les variables d'environnement
dotenv.config();

// Mock de la bibliothèque mysql2
jest.mock('mysql2', () => {
  return {
    createConnection: jest.fn().mockReturnValue({
      connect: jest.fn((callback) => callback(null)),
      query: jest.fn((query, values, callback) => callback(null)),
    }),
  };
});

// Tests de connexion à la base de données
describe('Tests de connexion à la base de données', () => {
  let mockConnect;

  // Configuration avant chaque test
  beforeEach(() => {
    mockConnect = jest.fn();
    mysql.createConnection.mockReturnValue({
      connect: mockConnect,
      query: jest.fn((query, values, callback) => callback(null)),
    });
    console.log = jest.fn();
    console.error = jest.fn();
  });

  // Test de connexion réussie
  it('devrait se connecter à MySQL avec succès', () => {
    mockConnect.mockImplementation((callback) => callback(null));

    // Importe à nouveau le module pour exécuter la connexion
    jest.isolateModules(() => {
      require('../db');
    });

    // Définit l'hôte attendu en fonction de l'environnement
    const expectedHost = process.env.DB_HOST === '127.0.0.1' ? 'host.docker.internal' : process.env.DB_HOST;

    // Vérifie que la fonction createConnection a été appelée avec les paramètres corrects
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: expectedHost,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    expect(mockConnect).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Connexion à MySQL réussie...');
  });

  it('devrait lancer une erreur si la connexion échoue', () => {
    const erreur = new Error('Échec de la connexion');
    mockConnect.mockImplementation((callback) => callback(erreur));

    expect(() => {
      jest.isolateModules(() => {
        require('../db');
      });
    }).toThrow(erreur);

    const expectedHost = process.env.DB_HOST === '127.0.0.1' ? 'host.docker.internal' : process.env.DB_HOST;

    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: expectedHost,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    expect(console.error).toHaveBeenCalledWith('Erreur de connexion à MySQL:', erreur);
  });
});
