// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hotels from '../Hotels';
import { describe, expect, test } from '@jest/globals';


describe('Hotels Component', () => {
  const tripWithHotels = {
    hotels: [
      { hotelName: 'Hôtel A', hotelAddress: 'Adresse A', price: '100€', rating: '4', description: 'Description A' },
      { hotelName: 'Hôtel B', hotelAddress: 'Adresse B', price: '150€', rating: '5', description: 'Description B' },
    ],
  };

  const tripWithoutHotels = {
    hotels: [],
  };

  test('renders hotels when available', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Hotels trip={tripWithHotels} />
      </MemoryRouter>
    );
    expect(getByText('Hôtels recommandés')).toBeInTheDocument();
    expect(getByText('Hôtel A')).toBeInTheDocument();
    expect(getByText('Hôtel B')).toBeInTheDocument();
  });

  test('renders message when no hotels are available', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Hotels trip={tripWithoutHotels} />
      </MemoryRouter>
    );
    expect(getByText('Aucun hôtel disponible pour ce voyage.')).toBeInTheDocument();
  });
});
