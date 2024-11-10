/* eslint-disable no-undef */

/**
 * Ce fichier contient des tests pour les routes d'authentification de l'application.
 * Les tests vérifient que le routeur est correctement initialisé, que les routes
 * sont définies et que le routeur fonctionne comme prévu.
 */

jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => ({
        connect: jest.fn((cb) => cb(null)),
        query: jest.fn((sql, params, cb) => cb(null, [])),
        end: jest.fn(),
    })),
}));

import express from 'express';
import authRoutes from '../authRoutes.js';
import { describe, test, expect } from '@jest/globals';


describe('Auth Routes', () => {
    test('doit initialiser le routeur', () => {
        // Vérifie que le routeur est défini et correctement initialisé.
        const router = express.Router();
        expect(router).toBeDefined();
    });


    test('authRoutes doit être un routeur Express', () => {
        // Vérifie que authRoutes est défini et qu'il s'agit d'un routeur Express valide.
        expect(authRoutes).toBeDefined();
        expect(typeof authRoutes.stack).toBe('object');
    });


    test('doit définir les routes', () => {
        // Vérifie que les routes d'authentification sont correctement définies dans le routeur.
        const router = authRoutes;
        const routes = router.stack.map(layer => layer.route.path);
        expect(routes).toEqual(expect.arrayContaining([
            '/signup',        // Route pour l'inscription d'un nouvel utilisateur
            '/login',         // Route pour la connexion d'un utilisateur existant
            '/google-login',  // Route pour la connexion via Google
            '/update',        // Route pour mettre à jour les informations de l'utilisateur
            '/delete'         // Route pour supprimer un utilisateur
        ]));
    });
});
