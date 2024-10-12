import { createUser, findUserByEmail, createGoogleUser } from '../User';
import db from '../../config/db.js';
import { describe, beforeEach, test, expect, jest } from '@jest/globals';


jest.mock('../../config/db.js');

describe('Tests des fonctions utilisateur', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('doit créer un nouvel utilisateur', (done) => {
    const email = 'test@example.com';
    const hashedPassword = 'hashedPassword';
    const firstName = 'John';
    const lastName = 'Doe';

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

    db.query.mockImplementation((query, params, callback) => {
      callback(null, [user]);
    });

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

  test('doit créer un nouvel utilisateur Google', (done) => {
    const email = 'googleuser@example.com';
    const fullName = 'Jane Doe';
    const hashedPassword = '';

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
