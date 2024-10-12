jest.mock('nodemailer', () => require('nodemailer-mock'));

import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { sendWelcomeEmail } from '../emailService';
import nodemailer from 'nodemailer';

describe('sendWelcomeEmail', () => {
  afterEach(() => {
    nodemailer.mock.reset();
  });

  it('devrait envoyer un email de bienvenue', async () => {
    const to = 'test@example.com';
    const firstName = 'Jean';

    await sendWelcomeEmail(to, firstName);

    const sentMail = nodemailer.mock.getSentMail();
    // Vérifie que l'email a été envoyé
    expect(sentMail).toHaveLength(1);
    expect(sentMail[0].to).toBe(to);
    expect(sentMail[0].subject).toBe('Bienvenue sur EasyTrip!');
    expect(sentMail[0].text).toContain(`Bonjour ${firstName}`);
  });

  it('devrait gérer les erreurs lors de l\'envoi de l\'email', async () => {
    // Simule une erreur d'envoi
    nodemailer.mock.setShouldFail(true);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(sendWelcomeEmail('test@example.com', 'Jean')).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur lors de l\'envoi de l\'email:'), expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
