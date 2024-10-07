// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toaster } from '../sonner';
import { toast } from 'sonner';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock du hook useTheme de next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Composant Toaster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche une toast de succès', async () => {
    render(<Toaster />);

    // Déclenche un toast de succès
    toast.success('Opération réussie');

    // Vérifie que le toast apparaît
    const toastElement = await screen.findByText(/opération réussie/i);
    expect(toastElement).toBeInTheDocument();
  });

  test('affiche une toast d\'erreur', async () => {
    render(<Toaster />);

    // Déclenche un toast d'erreur
    toast.error('Une erreur est survenue');

    // Vérifie que le toast apparaît
    const toastElement = await screen.findByText(/une erreur est survenue/i);
    expect(toastElement).toBeInTheDocument();
  });

  test('affiche une toast avec une description personnalisée', async () => {
    render(<Toaster />);

    // Déclenche un toast avec une description
    toast('Toast personnalisé', { description: 'Description du toast' });

    // Vérifie que le toast et la description apparaissent
    const toastElement = await screen.findByText(/toast personnalisé/i);
    const descriptionElement = await screen.findByText(/description du toast/i);
    expect(toastElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
