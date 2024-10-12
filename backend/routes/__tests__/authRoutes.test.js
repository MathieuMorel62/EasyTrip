import express from 'express';
import authRoutes from '../authRoutes.js';
import { describe, test, expect } from '@jest/globals';


describe('Auth Routes', () => {
    test('doit initialiser le routeur', () => {
        const router = express.Router();
        expect(router).toBeDefined();
    });

    test('authRoutes doit être un routeur Express', () => {
        expect(authRoutes).toBeDefined();
        expect(typeof authRoutes.stack).toBe('object');
    });

    test('doit définir les routes', () => {
        const router = authRoutes;
        const routes = router.stack.map(layer => layer.route.path);
        expect(routes).toEqual(expect.arrayContaining([
            '/signup',
            '/login',
            '/google-login',
            '/update',
            '/delete'
        ]));
    });
});
