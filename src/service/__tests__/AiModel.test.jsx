/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { chatSession } from '../AiModel';
import { describe, it, expect } from '@jest/globals';

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => ({
        startChat: jest.fn(() => ({
          sendMessage: jest.fn().mockResolvedValue({
            text: 'Réponse simulée',
          }),
        })),
      })),
    })),
  };
});

describe('Session de Chat', () => {
  it('Démarre une session de chat avec le modèle génératif', () => {
    expect(chatSession).toBeDefined();
  });

  it('devrait avoir une méthode sendMessage', () => {
    expect(typeof chatSession.sendMessage).toBe('function');
  });

  it('Envoi un message et recois une réponse', async () => {
    const response = await chatSession.sendMessage('Bonjour');
    expect(response.text).toBe('Réponse simulée');
  });
});
