/* eslint-disable no-unused-vars */

/**
 * Ce fichier contient des tests pour le composant Toaster, qui gère l'affichage des notifications toast.
 * Les tests vérifient que les toasts de succès, d'erreur et personnalisés s'affichent correctement
 * en fonction des actions effectuées.
 */

jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toaster } from '../sonner';
import { toast } from 'sonner';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock du hook useTheme de next-themes pour simuler le thème de l'application
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));


describe('Composant Toaster', () => {
  // Avant chaque test, nous nettoyons les mocks pour éviter les interférences entre les tests
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('affiche une toast de succès', async () => {
    render(<Toaster />);

    // Déclenche un toast de succès avec un message spécifique
    toast.success('Opération réussie');

    // Vérifie que le toast de succès apparaît dans le document
    const toastElement = await screen.findByText(/opération réussie/i);
    expect(toastElement).toBeInTheDocument();
  });


  test('affiche une toast d\'erreur', async () => {
    render(<Toaster />);

    // Déclenche un toast d'erreur avec un message spécifique
    toast.error('Une erreur est survenue');

    // Vérifie que le toast d'erreur apparaît dans le document
    const toastElement = await screen.findByText(/une erreur est survenue/i);
    expect(toastElement).toBeInTheDocument();
  });


  test('affiche une toast avec une description personnalisée', async () => {
    render(<Toaster />);

    // Déclenche un toast personnalisé avec un message et une description
    toast('Toast personnalisé', { description: 'Description du toast' });

    // Vérifie que le toast et sa description apparaissent dans le document
    const toastElement = await screen.findByText(/toast personnalisé/i);
    const descriptionElement = await screen.findByText(/description du toast/i);
    expect(toastElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
