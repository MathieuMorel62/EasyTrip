/* eslint-disable no-undef */

/**
 * Ce fichier contient des tests pour la fonction de validation d'inscription.
 * Les tests vérifient que les données d'inscription fournies par l'utilisateur
 * respectent les critères requis, tels que la présence de champs obligatoires,
 * la validité de l'email, et les critères de sécurité du mot de passe.
 */

jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

const { validateSignup } = require('../validators');
const { validationResult } = require('express-validator');
const httpMocks = require('node-mocks-http');
const { describe, it, expect } = require('@jest/globals');


describe('validateSignup', () => {
  const runValidators = async (req) => {
    for (let validator of validateSignup) {
      await validator.run(req);
    }
    return validationResult(req);
  };


  it('devrait réussir avec des données valides', async () => {
    // Teste que la validation réussit lorsque toutes les données requises sont fournies et valides.
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      }
    });
    const result = await runValidators(req);
    expect(result.isEmpty()).toBe(true);
  });


  it('devrait échouer si le prénom est manquant', async () => {
    // Vérifie que la validation échoue si le prénom n'est pas fourni.
    const req = httpMocks.createRequest({
      body: {
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      }
    });
    const result = await runValidators(req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe('Le prénom est obligatoire');
  });


  it('devrait échouer si l\'email est invalide', async () => {
    // Vérifie que la validation échoue si l'email fourni n'est pas valide.
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      }
    });
    const result = await runValidators(req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe('Email invalide');
  });


  it('devrait échouer si le mot de passe ne respecte pas les critères', async () => {
    // Vérifie que la validation échoue si le mot de passe ne respecte pas les critères de sécurité.
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'pass',
        confirmPassword: 'pass'
      }
    });
    const result = await runValidators(req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Le mot de passe doit contenir au moins 8 caractères' }),
        expect.objectContaining({ msg: 'Le mot de passe doit contenir au moins une majuscule' }),
        expect.objectContaining({ msg: 'Le mot de passe doit contenir au moins un chiffre' }),
        expect.objectContaining({ msg: 'Le mot de passe doit contenir au moins un caractère spécial' })
      ])
    );
  });


  it('devrait échouer si les mots de passe ne correspondent pas', async () => {
    // Vérifie que la validation échoue si le mot de passe et la confirmation ne correspondent pas.
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'Password1!',
        confirmPassword: 'Password2!'
      }
    });
    const result = await runValidators(req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe('Les mots de passe ne correspondent pas');
  });
});
