/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ViewTrip from './index';
import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

jest.mock('axios');
jest.mock('../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn().mockResolvedValue({
    data: {
      places: [{ photos: [{ name: 'photo-test.jpg' }] }],
    },
  }),
  PHOTO_REF_URL: 'http://example.com/{NAME}',
}));

describe('Composant ViewTrip', () => {
  let consoleLogSpy;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

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

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('affiche le spinner de chargement avant que les données ne soient récupérées', () => {
    render(
      <MemoryRouter initialEntries={['/view-trip/1']}>
        <Routes>
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByAltText('loading')).toBeInTheDocument();
  });

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

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Île-de-France - France'))).toBeInTheDocument();
    });
  });

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

    await waitFor(() => {
      expect(screen.queryByText('Paris - France')).not.toBeInTheDocument();
    });
  });

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

    await waitFor(() => {
      expect(screen.queryByText('Paris - France')).not.toBeInTheDocument();
    });
  });
});
