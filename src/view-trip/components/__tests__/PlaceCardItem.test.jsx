/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PlaceCardItem from '../PlaceCardItem';
import { BrowserRouter as Router } from 'react-router-dom';
import { GetPlaceDetails } from '../../../service/GlobalApi';
import { describe, expect, test, beforeEach } from '@jest/globals';


// Mock de la fonction GetPlaceDetails
jest.mock('../../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn(() => Promise.resolve({
    data: {
      places: [
        {
          photos: [
            { name: 'eiffel_tower_photo' }
          ]
        }
      ]
    }
  })),
  PHOTO_REF_URL: 'https://example.com/photos/{NAME}?key=YOUR_API_KEY',
}));

describe('PlaceCardItem Component', () => {
  const mockPlace = {
    placeName: 'Eiffel Tower',
    placeDetails: 'An iconic symbol of France',
    timeTravel: '2 hours',
  };

  const mockTrip = {
    location: 'Paris, France',
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  test('renders place name, details, and time travel', () => {
    render(
      <Router>
        <PlaceCardItem place={mockPlace} trip={mockTrip} />
      </Router>
    );

    expect(screen.getByText('Eiffel Tower')).toBeInTheDocument();
    expect(screen.getByText('An iconic symbol of France')).toBeInTheDocument();
    expect(screen.getByText('🕙 2 hours')).toBeInTheDocument();
  });

  test('renders default image when photoUrl is not available', () => {
    render(
      <Router>
        <PlaceCardItem place={mockPlace} trip={mockTrip} />
      </Router>
    );

    const imgElement = screen.getByAltText('avion');
    expect(imgElement).toHaveAttribute('src', '/avion.png');
  });

  test('renders link to Google Maps with correct query', () => {
    render(
      <Router>
        <PlaceCardItem place={mockPlace} trip={mockTrip} />
      </Router>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=Eiffel Tower,Paris, France');
  });

  test('fetches and displays photo URL', async () => {
    // Simule la réponse de l'API
    GetPlaceDetails.mockResolvedValue({
      data: {
        places: [
          {
            photos: [
              { name: 'eiffel_tower_photo' }
            ]
          }
        ]
      }
    });

    render(
      <Router>
        <PlaceCardItem place={mockPlace} trip={mockTrip} />
      </Router>
    );

    // Attend que l'image soit mise à jour avec la nouvelle URL
    await waitFor(() => {
      const imgElement = screen.getByAltText('avion');
      expect(imgElement).toHaveAttribute('src', expect.stringContaining('eiffel_tower_photo'));
    });
  });
});