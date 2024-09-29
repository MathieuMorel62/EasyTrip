// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutocompleteSearch from '../AutocompleteSearch';
import { test, expect, beforeEach, jest } from '@jest/globals';


beforeEach(() => {
  fetch.resetMocks();
});

test('affiche les suggestions et sélectionne une ville', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    geonames: [
      { geonameId: 1, name: 'Paris', countryName: 'France' }
    ]
  }));

  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Paris' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => expect(screen.getByText(/Paris/)).toBeInTheDocument());

  // Simuler le clic sur la suggestion
  fireEvent.mouseDown(screen.getByText(/Paris/));

  // Vérifier que la requête a été mise à jour
  expect(screen.getByPlaceholderText(/Rechercher une ville.../).value).toBe('Paris');
});

test('affiche correctement le champ de recherche', () => {
  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);
  expect(screen.getByPlaceholderText(/Rechercher une ville.../)).toBeInTheDocument();
});

test('sélectionne une ville dans les suggestions et met à jour l\'input', async () => {
  const handleChange = jest.fn();
  
  // Mock de la réponse fetch
  fetch.mockResponseOnce(JSON.stringify({
    geonames: [
      { geonameId: 1, name: 'Paris', countryName: 'France' }
    ]
  }));

  render(<AutocompleteSearch selectProps={{ onChange: handleChange }} />);

  // Simuler la saisie d'une requête
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Paris' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => expect(screen.getByText(/Paris/)).toBeInTheDocument());

  // Simuler le clic sur la suggestion
  fireEvent.mouseDown(screen.getByText(/Paris/));

  // Vérifier que la requête a été mise à jour
  expect(screen.getByPlaceholderText(/Rechercher une ville.../).value).toBe('Paris');
  // Vérifier que la fonction de changement a été appelée
  expect(handleChange).toHaveBeenCalledWith({ geonameId: 1, name: 'Paris', countryName: 'France' });
});

test('n\'affiche pas les suggestions si la requête est inférieure à 3 caractères', async () => {
  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête trop courte
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Pa' }, // Moins de 3 caractères
  });

  // Attendre un petit moment pour s'assurer que rien n'est affiché
  await waitFor(() => expect(screen.queryByText(/Paris/)).not.toBeInTheDocument());
});

test('affiche les suggestions de villes en fonction de la requête', async () => {
  // Mock de la réponse fetch
  fetch.mockResponseOnce(JSON.stringify({
    geonames: [
      { geonameId: 1, name: 'Paris', countryName: 'France' },
      { geonameId: 2, name: 'Lyon', countryName: 'France' }
    ]
  }));

  render(<AutocompleteSearch selectProps={{ onChange: jest.fn() }} />);

  // Simuler la saisie d'une requête
  fireEvent.change(screen.getByPlaceholderText(/Rechercher une ville.../), {
    target: { value: 'Par' },
  });

  // Attendre que les suggestions soient affichées
  await waitFor(() => {
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
    expect(screen.getByText(/Lyon/)).toBeInTheDocument();
  });
});
