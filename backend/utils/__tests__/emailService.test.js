// Ajout des variables d'environnement nécessaires pour les tests
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_SERVICE = 'gmail';
process.env.EMAIL_PASSWORD = 'password123';

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
        // Simule l'envoi d'un email avec succès
        callback(null, { response: 'Email envoyé' });
      }),
    }),
  };
});

import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { sendWelcomeEmail } from '../emailService';
import nodemailer from 'nodemailer';

describe('sendWelcomeEmail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait envoyer un email de bienvenue', async () => {
    const to = 'test@example.com';
    const firstName = 'Jean';

    await sendWelcomeEmail(to, firstName);

    // Vérifie que sendMail a été appelé correctement
    const sendMailMock = nodemailer.createTransport().sendMail;
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Bienvenue sur EasyTrip!',
      text: expect.stringContaining(`Bonjour ${firstName}`),
      html: expect.stringContaining(`<p>Bonjour ${firstName},</p>`),
    }), expect.any(Function));
  });

  it('devrait gérer les erreurs lors de l\'envoi de l\'email', async () => {
    // Simule une erreur d'envoi
    const sendMailMock = nodemailer.createTransport().sendMail; // Récupérer le mock de sendMail
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error('Failed to send email'));
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(sendWelcomeEmail('test@example.com', 'Jean')).rejects.toThrow('Failed to send email');

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur lors de l\'envoi de l\'email:'), expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
