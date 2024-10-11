// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlacesToVisit from '../PlacesToVisit';
import { describe, expect, it, beforeAll, afterAll, jest } from '@jest/globals';


describe('Composant PlacesToVisit', () => {
  const mockTrip = {
    itinerary: [
      { day: 'Lundi', placeName: 'Musée du Louvre', placeDetails: 'Un grand musée à Paris', timeTravel: '10:00', time: '2h' },
      { day: 'Lundi', placeName: 'Tour Eiffel', placeDetails: 'Monument emblématique', timeTravel: '14:00', time: '1h' },
      { day: 'Mardi', placeName: 'Cathédrale Notre-Dame', placeDetails: 'Cathédrale gothique', timeTravel: '09:00', time: '1.5h' },
    ],
  };

  let consoleErrorMock;
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it('Affiche le titre "Lieux à visiter"', () => {
    render(
      <MemoryRouter>
        <PlacesToVisit trip={mockTrip} />
      </MemoryRouter>
    );
    expect(screen.getByText('Lieux à visiter')).toBeInTheDocument();
  });

  it('Affiche les jours et les lieux correctement', () => {
    render(
      <MemoryRouter>
        <PlacesToVisit trip={mockTrip} />
      </MemoryRouter>
    );
    expect(screen.getByText('Lundi')).toBeInTheDocument();
    expect(screen.getByText('Mardi')).toBeInTheDocument();
    expect(screen.getByText('Musée du Louvre')).toBeInTheDocument();
    expect(screen.getByText('Tour Eiffel')).toBeInTheDocument();
    expect(screen.getByText('Cathédrale Notre-Dame')).toBeInTheDocument();
  });

  it('Affiche un message lorsqu\'il n\'y a pas d\'itinéraire disponible', () => {
    render(
      <MemoryRouter>
        <PlacesToVisit trip={{ itinerary: [] }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Aucun itinéraire disponible pour ce voyage.')).toBeInTheDocument();
  });
});
