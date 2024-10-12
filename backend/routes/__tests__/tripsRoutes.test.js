/* eslint-disable no-undef */
import express from 'express';
import tripsRouter from '../tripsRoutes';
import { describe, it, expect } from '@jest/globals';

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('routes des voyages', () => {
  it('devrait créer une instance de routeur', () => {
    expect(express.Router).toHaveBeenCalled();
  });

  it('devrait définir les routes', () => {
    const router = tripsRouter;

    expect(router.post).toHaveBeenCalledWith('/', expect.any(Function), expect.any(Function));
    expect(router.get).toHaveBeenCalledWith('/', expect.any(Function), expect.any(Function));
    expect(router.get).toHaveBeenCalledWith('/:tripId', expect.any(Function), expect.any(Function));
    expect(router.delete).toHaveBeenCalledWith('/:tripId', expect.any(Function), expect.any(Function));
  });
});
