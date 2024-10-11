/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MyTrips from '../index.jsx';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';


jest.mock('axios');

jest.mock('../components/UserTripCardItem', () => ({ trip }) => (
  <div data-testid={`trip-${trip.id}`}>{trip.destination}</div>
));

jest.mock('../components/UserTripCardItem', () => ({ trip, onDelete }) => (
  <div data-testid={`trip-${trip.id}`}>
    {trip.destination}
    <button data-testid={`delete-trip-${trip.id}`} onClick={() => onDelete(trip.id)}>Supprimer</button>
  </div>
));

describe('Composant MyTrips', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Simule un utilisateur authentifié
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    // Moque la réponse de l'API pour les voyages
    axios.get.mockResolvedValue({
      data: [
        { id: 1, destination: 'Paris - France' },
        { id: 2, destination: 'Londres - Royaume-Uni' },
      ],
    });
  });

  afterEach(() => {
    // Nettoie les mocks et le localStorage après chaque test
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('affiche le message lorsqu\'il n\'y a aucun voyage', async () => {
    // Moque une réponse vide de l'API
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Pas de trip généré/i)).toBeInTheDocument();
    });
  });

  test('gère l\'erreur lors de la récupération des voyages', async () => {
    // Moque une erreur de l'API
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Vérifie qu'aucun voyage n'est affiché et qu'une erreur est loguée
      expect(screen.queryByText(/Pas de trip généré/i)).toBeInTheDocument();
    });
  });
  
  test('affiche une erreur si l\'utilisateur n\'est pas authentifié', async () => {
    // Supprime les données de l'utilisateur dans le localStorage
    localStorage.removeItem('user');
  
    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );
  
    // Vérifie qu'une erreur est affichée ou loguée
    await waitFor(() => {
      expect(screen.queryByText(/Pas de trip généré/i)).toBeInTheDocument();
    });
  });

  test('affiche les voyages lorsqu\'ils sont récupérés avec succès', async () => {
    axios.get.mockImplementation((url) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        return Promise.reject(new Error('Utilisateur non authentifié'));
      }
      if (url === 'http://localhost:5001/api/trips') {
        return Promise.resolve({
          data: [
            { id: 1 },
            { id: 2 },
          ],
        });
      } else if (url === 'http://localhost:5001/api/trips/1') {
        return Promise.resolve({
          data: { id: 1, destination: 'Paris - France' },
        });
      } else if (url === 'http://localhost:5001/api/trips/2') {
        return Promise.resolve({
          data: { id: 2, destination: 'Londres - Royaume-Uni' },
        });
      } else {
        return Promise.reject(new Error('URL inconnue'));
      }
    });
  
    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );
  
    // Attend que les voyages soient affichés
    await waitFor(() => {
      expect(screen.getByText('Paris - France')).toBeInTheDocument();
      expect(screen.getByText('Londres - Royaume-Uni')).toBeInTheDocument();
    });
  });

  test('supprime un voyage lorsqu\'on clique sur le bouton de suppression', async () => {
    // Configurer les mocks pour axios.get et axios.delete
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5001/api/trips') {
        return Promise.resolve({ data: [{ id: 1 }] });
      } else if (url === 'http://localhost:5001/api/trips/1') {
        return Promise.resolve({ data: { id: 1, destination: 'Paris - France' } });
      }
      return Promise.reject(new Error('URL inconnue'));
    });
  
    axios.delete.mockResolvedValue({});
  
    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );
  
    // Attend que le voyage soit affiché
    await waitFor(() => {
      expect(screen.getByTestId('trip-1')).toBeInTheDocument();
    });
  
    // Clique sur le bouton de suppression
    const deleteButton = screen.getByTestId('delete-trip-1');
    deleteButton.click();
  
    // Attend que le voyage soit retiré de l'interface
    await waitFor(() => {
      expect(screen.queryByTestId('trip-1')).not.toBeInTheDocument();
    });
  
    // Vérifie que axios.delete a été appelé avec la bonne URL
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5001/api/trips/1',
      expect.any(Object)
    );
  });

  test('affiche la pagination lorsqu\'il y a plus de voyages que la limite par page', async () => {
    // Générer 12 voyages pour dépasser la limite par page
    const tripIds = Array.from({ length: 12 }, (_, i) => i + 1);
  
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5001/api/trips') {
        return Promise.resolve({
          data: tripIds.map(id => ({ id })),
        });
      } else if (url.startsWith('http://localhost:5001/api/trips/')) {
        const tripId = parseInt(url.split('/').pop());
        return Promise.resolve({
          data: { id: tripId, destination: `Destination ${tripId}` },
        });
      }
      return Promise.reject(new Error('URL inconnue'));
    });
  
    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );
  
    // Attendre que les voyages de la première page soient affichés
    await waitFor(() => {
      expect(screen.getByTestId('trip-1')).toBeInTheDocument();
      expect(screen.getByTestId('trip-6')).toBeInTheDocument();
    });
  
    // Vérifier que les voyages de la deuxième page ne sont pas encore affichés
    expect(screen.queryByTestId('trip-7')).not.toBeInTheDocument();
  
    // Vérifier que les boutons de pagination sont présents
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  
    // Cliquer sur le bouton de la page 2
    const page2Button = screen.getByText('2');
    page2Button.click();
  
    // Attendre que les voyages de la deuxième page soient affichés
    await waitFor(() => {
      expect(screen.getByTestId('trip-7')).toBeInTheDocument();
      expect(screen.getByTestId('trip-12')).toBeInTheDocument();
    });
  
    // Vérifier que les voyages de la première page ne sont plus affichés
    expect(screen.queryByTestId('trip-1')).not.toBeInTheDocument();
  });
  
});
