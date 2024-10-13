// Mock nodemailer avec nodemailer-mock
jest.mock('nodemailer', () => require('nodemailer-mock'));

import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { sendWelcomeEmail } from '../emailService';
import nodemailer from 'nodemailer';

describe('sendWelcomeEmail', () => {
  afterEach(() => {
    // Réinitialise le mock après chaque test
    nodemailer.mock.reset();
  });

  it('devrait envoyer un email de bienvenue', async () => {
    const to = 'test@example.com';
    const firstName = 'Jean';

    // Appelle la fonction sendWelcomeEmail
    await sendWelcomeEmail(to, firstName);

    const sentMail = nodemailer.mock.getSentMail();

    // Vérifie que l'email a bien été envoyé
    expect(sentMail).toHaveLength(1);
    expect(sentMail[0].to).toBe(to);
    expect(sentMail[0].subject).toBe('Bienvenue sur EasyTrip!');
    expect(sentMail[0].text).toContain(`Bonjour ${firstName}`);
  });

  it('devrait gérer les erreurs lors de l\'envoi de l\'email', async () => {
    // Simule une erreur lors de l'envoi de l'email
    nodemailer.mock.setShouldFail(true);

    // Simule console.error pour vérifier qu'il est appelé
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Vérifie que la fonction lève une erreur lors de l'échec de l'envoi
    await expect(sendWelcomeEmail('test@example.com', 'Jean')).rejects.toThrow();

    // Vérifie que console.error a été appelé avec un message d'erreur
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur lors de l\'envoi de l\'email:'), expect.any(Error));

    // Restaure le comportement original de console.error
    consoleErrorSpy.mockRestore();
  });
});
