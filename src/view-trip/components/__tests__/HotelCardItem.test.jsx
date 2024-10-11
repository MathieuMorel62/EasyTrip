/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelCardItem from '../HotelCardItem';
import { GetPlaceDetails } from '../../../service/GlobalApi';
import { describe, expect, test } from '@jest/globals';


jest.mock('../../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn(),
  PHOTO_REF_URL: 'http://example.com/photos/{NAME}',
}));

describe('HotelCardItem', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockHotel = {
    hotelName: 'Hôtel Test',
    hotelAddress: '123 Rue de Test, Testville',
    price: '100',
    rating: '4 étoiles',
  };

  test('doit appeler GetPlaceDetails avec le nom de l\'hôtel', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [
          {
            photos: [{ name: 'test-photo' }],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <HotelCardItem hotel={mockHotel} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(GetPlaceDetails).toHaveBeenCalledWith({ textQuery: mockHotel.hotelName });
    });
  });

  test('doit afficher l\'image de l\'hôtel si une photo est disponible', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [
          {
            photos: [{ name: 'test-photo' }],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <HotelCardItem hotel={mockHotel} />
      </MemoryRouter>
    );

    const expectedUrl = 'http://example.com/photos/test-photo';

    await waitFor(() => {
      const imgElement = screen.getByAltText('');
      expect(imgElement.src).toContain(expectedUrl);
    });
  });

  test('doit afficher une image par défaut si aucune photo n\'est trouvée', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [],
      },
    });

    render(
      <MemoryRouter>
        <HotelCardItem hotel={mockHotel} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const imgElement = screen.getByAltText('');
      expect(imgElement.src).toContain('/avion.png');
    });
  });

  test('doit afficher une image par défaut en cas d\'erreur de l\'API', async () => {
    GetPlaceDetails.mockRejectedValueOnce(new Error('Erreur lors de la récupération des détails du lieu'));

    render(
      <MemoryRouter>
        <HotelCardItem hotel={mockHotel} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const imgElement = screen.getByAltText('');
      expect(imgElement.src).toContain('/avion.png');
    });
  });
});
