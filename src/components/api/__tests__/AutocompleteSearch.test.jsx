/* eslint-disable no-unused-vars */

/** Ce fichier contient des tests pour le composant AutocompleteSearch.
 *  Les tests vérifient le comportement de la recherche de villes, y compris l'affichage des suggestions,
 * la sélection d'une ville, et la gestion des entrées utilisateur.
 */

import { jest, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutocompleteSearch from '../AutocompleteSearch';

// Mock de mysql2 pour simuler les connexions à la base de données
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((cb) => cb(null)),
    query: jest.fn((sql, params, cb) => cb(null, [])),
    end: jest.fn(),
  })),
}));

// Configuration des mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
  // Mock de la fonction fetch globale pour simuler les appels API
  global.fetch = jest.fn();
});


// Test pour vérifier l'affichage des suggestions et la sélection d'une ville
test('affiche les suggestions et sélectionne une ville', async () => {
  // Simulation d'une réponse réussie de l'API avec une ville
  global.fetch.mockImplementationOnce(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        geonames: [
          { geonameId: 1, name: 'Paris', countryName: 'France' }
        ]
      })
    })
  );

  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête pour rechercher 'Paris'
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Paris' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => expect(screen.getByText(/Paris/)).toBeInTheDocument());

  // Simuler le clic sur la suggestion 'Paris'
  fireEvent.mouseDown(screen.getByText(/Paris/));

  // Vérifier que l'input a été mis à jour avec la ville sélectionnée
  expect(screen.getByPlaceholderText(/Rechercher une ville.../).value).toBe('Paris');
});


// Test pour vérifier que le champ de recherche s'affiche correctement
test('affiche correctement le champ de recherche', () => {
  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);
  // Vérifier que le champ de recherche est présent dans le document
  expect(screen.getByPlaceholderText(/Rechercher une ville.../)).toBeInTheDocument();
});


// Test pour vérifier la sélection d'une ville dans les suggestions et la mise à jour de l'input
test('sélectionne une ville dans les suggestions et met à jour l\'input', async () => {
  const handleChange = jest.fn();
  
  // Mock de la réponse fetch pour simuler une ville
  global.fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      geonames: [
        { geonameId: 1, name: 'Paris', countryName: 'France' }
      ]
    })
  }));

  render(<AutocompleteSearch selectProps={{ onChange: handleChange }} />);

  // Simuler la saisie d'une requête pour rechercher 'Paris'
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Paris' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => expect(screen.getByText(/Paris/)).toBeInTheDocument());

  // Simuler le clic sur la suggestion 'Paris'
  fireEvent.mouseDown(screen.getByText(/Paris/));

  // Vérifier que l'input a été mis à jour avec la ville sélectionnée
  expect(screen.getByPlaceholderText(/Rechercher une ville.../).value).toBe('Paris');
  // Vérifier que la fonction de changement a été appelée avec les données de la ville
  expect(handleChange).toHaveBeenCalledWith({ geonameId: 1, name: 'Paris', countryName: 'France' });
});


// Test pour vérifier que les suggestions ne s'affichent pas si la requête est inférieure à 3 caractères
test('n\'affiche pas les suggestions si la requête est inférieure à 3 caractères', async () => {
  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête trop courte
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Pa' }, // Moins de 3 caractères
  });

  // Attendre un petit moment pour s'assurer que rien n'est affiché
  await waitFor(() => expect(screen.queryByText(/Paris/)).not.toBeInTheDocument());
});


// Test pour vérifier l'affichage des suggestions de villes en fonction de la requête
test('affiche les suggestions de villes en fonction de la requête', async () => {
  // Simulation d'une réponse réussie de l'API avec plusieurs villes
  global.fetch.mockImplementationOnce(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        geonames: [
          { geonameId: 1, name: 'Paris', countryName: 'France' },
          { geonameId: 2, name: 'Lyon', countryName: 'France' }
        ]
      })
    })
  );

  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête pour rechercher 'Par'
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Par' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => {
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
    expect(screen.getByText(/Lyon/)).toBeInTheDocument();
  });
});
