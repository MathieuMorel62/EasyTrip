/* eslint-disable no-undef */
import mysql from 'mysql2/promise';
import db from '../db';

jest.mock('mysql2/promise');

describe('Database connection', () => {
  it('should connect successfully', async () => {
    const mockConnection = {
      connect: jest.fn(),
      query: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);

    await db.connect();

    expect(mysql.createConnection).toHaveBeenCalled();
    expect(mockConnection.connect).toHaveBeenCalled();
  });

  // Ajoutez d'autres tests si nécessaire
});
