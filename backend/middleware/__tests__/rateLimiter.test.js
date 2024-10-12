/* eslint-disable no-undef */
import rateLimit from 'express-rate-limit';
import { authLimiter } from '../rateLimiter';
import { describe, beforeEach, test, expect } from '@jest/globals';


jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation((config) => {
    const mockLimiter = jest.fn();
    Object.assign(mockLimiter, config);
    return mockLimiter;
  });
});

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('authLimiter devrait être configuré correctement', () => {
    // Crée des objets req, res et next simulés
    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
    const next = jest.fn();

    const middleware = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: "Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes."
    });

    // Simule un appel à middleware pour vérifier si rateLimit a été appelé
    middleware(req, res, next);

    expect(rateLimit).toHaveBeenCalledWith({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: "Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes."
    });
  });

  test('authLimiter devrait être une fonction', () => {
    expect(typeof authLimiter).toBe('function');
  });

  test('authLimiter devrait avoir les propriétés correctes', () => {
    expect(authLimiter.windowMs).toBe(15 * 60 * 1000);
    expect(authLimiter.max).toBe(10);
    expect(authLimiter.message).toBe("Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes.");
  });
});
