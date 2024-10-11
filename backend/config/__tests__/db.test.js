/* eslint-disable no-undef */
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { expect, describe, beforeEach, it } from '@jest/globals';


dotenv.config();

jest.mock('mysql2', () => {
  return {
    createConnection: jest.fn().mockReturnValue({
      connect: jest.fn((callback) => callback(null)),
      query: jest.fn((query, values, callback) => callback(null)),
    }),
  };
});

describe('Tests de connexion à la base de données', () => {
  let mockConnect;

  beforeEach(() => {
    mockConnect = jest.fn();
    mysql.createConnection.mockReturnValue({
      connect: mockConnect,
      query: jest.fn((query, values, callback) => callback(null)),
    });
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it('devrait se connecter à MySQL avec succès', () => {
    mockConnect.mockImplementation((callback) => callback(null));

    // Importer à nouveau le module pour exécuter la connexion
    jest.isolateModules(() => {
      require('../db');
    });

    const expectedHost = process.env.DB_HOST === '127.0.0.1' ? 'host.docker.internal' : process.env.DB_HOST;

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
