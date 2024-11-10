/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Tests pour le composant InfoSection.
 * 
 * Ce fichier contient des tests unitaires pour le composant InfoSection, 
 * qui affiche les détails d'un voyage, y compris la localisation, le budget, 
 * la durée et les images associées. Les tests vérifient que les informations 
 * sont correctement rendues et que les images par défaut ou spécifiques 
 * sont affichées selon la disponibilité des données.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import InfoSection from '../InfoSection';
import { describe, expect, test } from '@jest/globals';

// Mock de mysql2 pour éviter les connexions réelles
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((cb) => cb(null)),
    query: jest.fn((sql, params, cb) => cb(null, [])),
    end: jest.fn(),
  })),
}));

// Simulation des appels API pour obtenir les détails des lieux
jest.mock('../../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn(() => Promise.resolve({
    data: {
      places: [
        {
          photos: [{ name: 'photo_name' }],
        },
      ],
    },
  })),
  PHOTO_REF_URL: 'http://example.com/{NAME}/media',
}));

// Suite de tests pour le composant InfoSection
describe('InfoSection', () => {
  const tripMock = {
    location: 'Paris',
    locations: {
      adminName1: 'Île-de-France',
      countryName: 'France',
    },
    budget: '1000€',
    nbOfDays: 5,
    traveler: '2',
  };

  // Désactive temporairement console.error pour éviter les messages d'erreur pendant les tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaure console.error après l'exécution des tests
  afterAll(() => {
    console.error.mockRestore();
  });

  // Teste le rendu correct de la localisation et des détails du voyage
  test('renders location and details correctly', () => {
    render(<InfoSection trip={tripMock} />);
    
    // Vérifie que le nom de la ville est affiché deux fois (une fois dans le titre et une fois dans le contenu)
    expect(screen.getAllByText(/Paris/i)).toHaveLength(2);
    
    // Vérifie que les détails du voyage (région, pays, budget, durée et nombre de voyageurs) sont affichés correctement
    expect(screen.getByText(/Île-de-France/i)).toBeInTheDocument();
    expect(screen.getByText(/France/i)).toBeInTheDocument();
    expect(screen.getByText(/1000€/i)).toBeInTheDocument();
    expect(screen.getByText(/5 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de voyageurs: 2/i)).toBeInTheDocument();
  });

  // Teste le rendu d'une image par défaut lorsque l'URL de la photo n'est pas disponible
  test('renders default image when photoUrl is not available', () => {
    render(<InfoSection trip={tripMock} />);
    
    // Vérifie que l'image par défaut (avion) est affichée
    const img = screen.getByAltText(/avion/i);
    expect(img.src).toContain('/avion.png');
  });

  // Teste le rendu d'une image lorsque l'URL de la photo est disponible
  test('renders image when photoUrl is available', async () => {
    await act(async () => {
      render(<InfoSection trip={tripMock} />);
    });
    
    // Attend que l'image soit mise à jour avec la photo spécifique du voyage
    const img = await screen.findByAltText(/avion/i);
    expect(img.src).toContain('photo_name');
  });
});
