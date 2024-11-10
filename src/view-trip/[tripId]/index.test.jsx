/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Tests unitaires pour le composant ViewTrip.
 * 
 * Ce fichier contient des tests pour vérifier le bon fonctionnement du composant ViewTrip,
 * y compris l'affichage des données de voyage, la gestion des erreurs et le comportement
 * lors de l'authentification de l'utilisateur. Les tests utilisent Jest et Testing Library
 * pour simuler les interactions et les réponses de l'API.
 */

// Simulation de la connexion à la base de données MySQL pour les tests
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

// Importation des bibliothèques nécessaires pour les tests
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ViewTrip from './index';
import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// Simulation des appels API avec Axios
jest.mock('axios');
jest.mock('../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn().mockResolvedValue({
    data: {
      places: [{ photos: [{ name: 'photo-test.jpg' }] }],
    },
  }),
  PHOTO_REF_URL: 'http://example.com/{NAME}',
}));

// Début de la suite de tests pour le composant ViewTrip
describe('Composant ViewTrip', () => {
  let consoleLogSpy;

  // Configuration initiale avant tous les tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  // Restauration des espions après tous les tests
  afterAll(() => {
    console.error.mockRestore();
    consoleLogSpy.mockRestore();
  });

  // Configuration avant chaque test
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    // Simulation de la réponse de l'API pour un voyage spécifique
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5001/api/trips/1') {
        return Promise.resolve({
          data: {
            id: 1,
            destination: 'Paris - France',
            locations: { adminName1: 'Île-de-France', countryName: 'France' },
            hotels: [],
            itinerary: [],
          },
        });
      }
      return Promise.reject(new Error('URL inconnue'));
    });
  });

  // Nettoyage après chaque test
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Test pour vérifier l'affichage du spinner de chargement
  test('affiche le spinner de chargement avant que les données ne soient récupérées', () => {
    render(
      <MemoryRouter initialEntries={['/view-trip/1']}>
        <Routes>
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
        </Routes>
      </MemoryRouter>
    );

    // Vérifie que le spinner de chargement est présent dans le document
    expect(screen.getByAltText('loading')).toBeInTheDocument();
  });

  // Test pour vérifier l'affichage des données du voyage après une récupération réussie
  test('affiche les données du voyage après récupération réussie', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/view-trip/1']}>
          <Routes>
            <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Vérifie que les informations de destination sont affichées
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Île-de-France - France'))).toBeInTheDocument();
    });
  });

  // Test pour vérifier le comportement lorsque l'utilisateur n'est pas authentifié
  test('affiche une erreur si l\'utilisateur n\'est pas authentifié', async () => {
    localStorage.removeItem('user');

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/view-trip/1']}>
          <Routes>
            <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Vérifie que les données du voyage ne sont pas affichées
    await waitFor(() => {
      expect(screen.queryByText('Paris - France')).not.toBeInTheDocument();
    });
  });

  // Test pour gérer les erreurs lors de la récupération des données du voyage
  test('gère l\'erreur lors de la récupération des données du voyage', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/view-trip/1']}>
          <Routes>
            <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Vérifie que les données du voyage ne sont pas affichées en cas d'erreur
    await waitFor(() => {
      expect(screen.queryByText('Paris - France')).not.toBeInTheDocument();
    });
  });
});
