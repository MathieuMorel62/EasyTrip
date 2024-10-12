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
