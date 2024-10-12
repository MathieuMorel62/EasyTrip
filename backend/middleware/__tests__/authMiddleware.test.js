import jwt from 'jsonwebtoken';
import { verifyToken } from '../authMiddleware';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('Middleware d\'authentification', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  test('devrait renvoyer une erreur 403 si aucun token n\'est fourni', () => {
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Token requis');
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait appeler next() si un token valide est fourni', () => {
    const token = 'Bearer valid_token';
    const decodedToken = { userId: '123' };
    req.headers['authorization'] = token;
    jwt.verify.mockReturnValue(decodedToken);

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  test('devrait renvoyer une erreur 401 si le token est invalide', () => {
    const token = 'Bearer invalid_token';
    req.headers['authorization'] = token;
    jwt.verify.mockImplementation(() => {
      throw new Error('Token invalide');
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Token invalide');
    expect(next).not.toHaveBeenCalled();
  });
});
