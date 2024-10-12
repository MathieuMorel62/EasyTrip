/* eslint-disable no-undef */
import mysql from 'mysql2/promise';
import db from '../db';
import { describe, test, expect, beforeEach } from '@jest/globals';


// Mock de mysql2/promise
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn(),
}));

describe('Module de base de données', () => {
  let mockConnection;

  beforeEach(() => {
    // Réinitialise les mocks avant chaque test
    jest.clearAllMocks();
    
    // Mock pour la connexion
    mockConnection = {
      connect: jest.fn(),
      query: jest.fn(),
    };
    
    // Configuration du mock de createConnection pour retourner notre mockConnection
    mysql.createConnection.mockResolvedValue(mockConnection);
    
    // Réinitialise la connexion du module db
    db.connection = null;
  });

  test('devrait se connecter à la base de données avec succès', async () => {
    await db.connect();

    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(db.connection).toBe(mockConnection);
  });

  test('devrait lancer une erreur si la connexion échoue', async () => {
    const errorMessage = 'Erreur de connexion';
    mockConnection.connect.mockRejectedValue(new Error(errorMessage));

    await expect(db.connect()).rejects.toThrow(errorMessage);
  });

  test('devrait exécuter une requête avec succès', async () => {
    const mockResult = [{ id: 1, name: 'Test' }];
    mockConnection.query.mockResolvedValue(mockResult);

    const sql = 'SELECT * FROM test';
    const params = [];

    const result = await db.query(sql, params);

    expect(mockConnection.query).toHaveBeenCalledWith(sql, params);
    expect(result).toBe(mockResult);
  });

  test('devrait se connecter automatiquement si non connecté lors d\'une requête', async () => {
    const mockResult = [{ id: 1, name: 'Test' }];
    mockConnection.query.mockResolvedValue(mockResult);

    const sql = 'SELECT * FROM test';
    const params = [];

    await db.query(sql, params);

    expect(mysql.createConnection).toHaveBeenCalled();
    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledWith(sql, params);
  });
});
