/* eslint-disable no-undef */
import { signup, login, googleLogin, updateUser, deleteUser } from '../authController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../config/db';
import { validationResult } from 'express-validator';
import { findUserByEmail } from '../../models/User';
import axios from 'axios';
import { sendWelcomeEmail } from '../../utils/emailService';
import { describe, it, expect, beforeEach } from '@jest/globals';


jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));
jest.mock('../../models/User');
jest.mock('axios');
jest.mock('../../utils/emailService');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    db.query.mockImplementation((query, params, callback) => {
      if (callback) {
        callback(null, []);
      } else {
        return Promise.resolve([]);
      }
    });
    req = {
      body: {},
      user: { id: 'testUserId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('signup', () => {
    it('devrait crer un nouvel utilisateur et renvoyer un token', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      bcrypt.hashSync.mockReturnValue('hashedPassword');
      jwt.sign.mockReturnValue('testToken');
      db.query.mockImplementation((query, params, callback) => {
        if (query.startsWith('INSERT')) {
          callback(null);
        } else {
          callback(null, [{ id: 'testUserId' }]);
        }
      });

      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'testToken',
        user: expect.objectContaining({
          id: 'testUserId',
          email: 'john@example.com',
          name: 'John Doe'
        })
      });
      expect(sendWelcomeEmail).toHaveBeenCalledWith('john@example.com', 'John');
    });

    it('devrait renvoyer une erreur 400 si la validation échoue', async () => {
      validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Erreur de validation' }] });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Erreur de validation' }] });
    });

    it('devrait renvoyer une erreur 500 si l\'insertion dans la base de données échoue', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      db.query.mockImplementation((query, params, callback) => {
        if (query.startsWith('INSERT')) {
          callback(new Error('Erreur d\'insertion'));
        }
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Erreur serveur');
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur existant et renvoyer un token', async () => {
      const mockUser = {
        id: 'testUserId',
        email: 'john@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe'
      };
      db.query.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('testToken');

      req.body = {
        email: 'john@example.com',
        password: 'password123'
      };

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: 'testToken',
        user: expect.objectContaining({
          id: 'testUserId',
          email: 'john@example.com',
          name: 'John Doe'
        })
      });
    });

    it('devrait renvoyer une erreur 401 si l\'utilisateur n\'existe pas', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Email ou mot de passe incorrect');
    });

    it('devrait renvoyer une erreur 401 si le mot de passe est incorrect', async () => {
      const mockUser = {
        id: 'testUserId',
        email: 'john@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe'
      };
      db.query.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });
      bcrypt.compare.mockResolvedValue(false);

      req.body = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Email ou mot de passe incorrect');
    });
  });

  describe('googleLogin', () => {
    it('devrait connecter ou créer un utilisateur avec Google et renvoyer un token', async () => {
      const googleUserInfo = {
        data: {
          email: 'john@gmail.com',
          name: 'John Doe'
        }
      };
      axios.get.mockResolvedValue(googleUserInfo);
      findUserByEmail.mockImplementation((email, callback) => {
        callback(null, []);
      });
      db.query.mockImplementation((query, params, callback) => {
        if (query.startsWith('INSERT')) {
          callback(null);
        } else {
          callback(null, [{ id: 'newUserId' }]);
        }
      });
      jwt.sign.mockReturnValue('testToken');

      req.body = { token: 'googleToken' };

      await googleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'testToken',
        user: expect.objectContaining({
          id: 'newUserId',
          email: 'john@gmail.com',
          name: 'John Doe'
        })
      });
    });

    it('devrait connecter un utilisateur existant avec Google', async () => {
      const googleUserInfo = {
        data: {
          email: 'john@gmail.com',
          name: 'John Doe'
        }
      };
      axios.get.mockResolvedValue(googleUserInfo);
      findUserByEmail.mockImplementation((email, callback) => {
        callback(null, [{ id: 'existingUserId', email: 'john@gmail.com', firstName: 'John', lastName: 'Doe' }]);
      });
      jwt.sign.mockReturnValue('testToken');

      req.body = { token: 'googleToken' };

      await googleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'testToken',
        user: expect.objectContaining({
          id: 'existingUserId',
          email: 'john@gmail.com',
          name: 'John Doe'
        })
      });
    });

    it('devrait renvoyer une erreur 500 si la vérification de l\'utilisateur échoue', async () => {
      axios.get.mockResolvedValue({ data: { email: 'john@gmail.com', name: 'John Doe' } });
      findUserByEmail.mockImplementation((email, callback) => {
        callback(new Error('Erreur de vérification'));
      });

      req.body = { token: 'googleToken' };

      await googleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la vérification de l\'utilisateur' });
    });
  });

  describe('updateUser', () => {
    it('devrait mettre à jour les informations de l\'utilisateur', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      req.body = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'newPassword'
      };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe'
      });
    });

    it('devrait mettre à jour le mot de passe si fourni', async () => {
      bcrypt.hashSync.mockReturnValue('newHashedPassword');
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      req.body = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'newPassword'
      };

      await updateUser(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword', 10);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('password = ?'),
        expect.arrayContaining(['newHashedPassword']),
        expect.any(Function)
      );
    });

    it('devrait renvoyer une erreur 500 si la mise à jour échoue', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('Erreur de mise à jour'));
      });

      req.body = {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Erreur serveur');
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer l\'utilisateur', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur supprimé avec succès'
      });
    });

    it('devrait renvoyer une erreur 500 si la suppression échoue', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('Erreur de suppression'));
      });

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Erreur serveur');
    });
  });
});
