/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import InfoSection from '../InfoSection';
import { describe, expect, test } from '@jest/globals';


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

  // Désactive temporairement console.error
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Restaure console.error après les tests
  afterAll(() => {
    console.error.mockRestore();
  });

  test('renders location and details correctly', () => {
    render(<InfoSection trip={tripMock} />);
    
    // Vérifie que le nom de la ville est affiché
    expect(screen.getAllByText(/Paris/i)).toHaveLength(2);
    
    // Vérifie que les détails du voyage sont affichés
    expect(screen.getByText(/Île-de-France/i)).toBeInTheDocument();
    expect(screen.getByText(/France/i)).toBeInTheDocument();
    expect(screen.getByText(/1000€/i)).toBeInTheDocument();
    expect(screen.getByText(/5 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de voyageurs: 2/i)).toBeInTheDocument();
  });

  test('renders default image when photoUrl is not available', () => {
    render(<InfoSection trip={tripMock} />);
    
    // Vérifie que l'image par défaut est affichée
    const img = screen.getByAltText(/avion/i);
    expect(img.src).toContain('/avion.png');
  });

  test('renders image when photoUrl is available', async () => {
    await act(async () => {
      render(<InfoSection trip={tripMock} />);
    });
    
    // Attend que l'image soit mise à jour
    const img = await screen.findByAltText(/avion/i);
    expect(img.src).toContain('photo_name');
  });
});
