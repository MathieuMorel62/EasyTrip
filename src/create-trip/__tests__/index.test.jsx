/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import { toast } from 'sonner';
import axios from 'axios';

// Mock de la bibliothèque sonner
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

// Mock de axios
jest.mock('axios');

// Mock de l'API pour AutocompleteSearch
jest.mock('@/components/api/AutocompleteSearch.jsx', () => {
  return function MockAutocompleteSearch({ selectProps }) {
    return (
      <input
        placeholder="Rechercher une ville..."
        onChange={(e) =>
          selectProps.onChange({
            name: e.target.value,
            adminName1: 'Île-de-France',
            lat: '48.8566',
            lng: '2.3522',
          })
        }
      />
    );
  };
});

// Mock de Framer Motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    __esModule: true,
    motion: {
      div: React.forwardRef(({ children }, ref) => <div ref={ref}>{children}</div>),
      h2: React.forwardRef(({ children }, ref) => <h2 ref={ref}>{children}</h2>),
    },
  };
});

// Mock de useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Mock de chatSession
jest.mock('@/service/AiModel', () => ({
  chatSession: {
    sendMessage: jest.fn().mockResolvedValue({
      response: {
        text: jest.fn().mockResolvedValue(
          JSON.stringify({
            itinerary: [],
            hotelOptions: [],
          })
        ),
      },
    }),
  },
}));

// Importer le composant après les mocks
import CreateTrip from '../index.jsx';

describe('Composant CreateTrip', () => {
  let consoleSpy;

  beforeEach(() => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    // Espionner console.log pour éviter les logs pendant les tests
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Nettoyage du localStorage et des mocks après chaque test
    localStorage.clear();
    jest.clearAllMocks();

    // Restaurer console.log après les tests
    consoleSpy.mockRestore();
  });

  test("affiche un message d'erreur lorsque les champs requis sont vides", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    const button = screen.getByRole('button', { name: /Générer mon voyage/i });
    fireEvent.click(button);

    expect(toast).toHaveBeenCalledWith('Veuillez remplir tous les champs obligatoires');
  });

  test("permet de sélectionner une destination", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    const destinationInput = screen.getByPlaceholderText(/Rechercher une ville.../i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });

    expect(destinationInput.value).toBe('Paris');
  });

  test("permet de sélectionner le nombre de jours", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    const daysInput = screen.getByPlaceholderText(/Exemple: 3/i);
    fireEvent.change(daysInput, { target: { value: '5' } });

    expect(daysInput.value).toBe('5');
  });

  test("permet de sélectionner un budget", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    const budgetOption = screen.getByText(/Modéré/i);
    fireEvent.click(budgetOption);

    // Vérifie que la classe est appliquée à l'élément cliqué
    expect(budgetOption.parentElement).toHaveClass('border-solid border-purple-600');
  });

  test("permet de sélectionner le nombre de voyageurs", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    // Utilise `findByText` pour attendre que l'élément soit présent
    const travelerOption = await screen.findByText('Seul(e)');

    fireEvent.click(travelerOption);

    expect(travelerOption.parentElement).toHaveClass('border-solid border-purple-600');
  });

  test("génère un voyage et redirige vers la page de visualisation", async () => {
    // Mock de la réponse d'axios.post
    axios.post.mockResolvedValueOnce({ data: { tripId: '12345' } });

    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <MemoryRouter>
          <CreateTrip />
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    // Remplit les champs requis
    fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../i), {
      target: { value: 'Paris' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Exemple: 3/i), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByText(/Modéré/i));
    fireEvent.click(screen.getByText('Seul(e)'));

    const button = screen.getByRole('button', { name: /Générer mon voyage/i });
    fireEvent.click(button);

    // Attend que l'appel axios.post soit effectué
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5001/api/trips',
        expect.any(Object),
        {
          headers: {
            Authorization: `Bearer fake-token`,
          },
        }
      );
    });

    // Vérifie que la redirection a eu lieu
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/view-trip/12345');
  });
});
