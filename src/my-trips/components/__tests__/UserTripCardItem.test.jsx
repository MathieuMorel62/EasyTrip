/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserTripCardItem from '../UserTripCardItem';
import { GetPlaceDetails } from '../../../service/GlobalApi';
import { BrowserRouter as Router } from 'react-router-dom';
import { PHOTO_REF_URL } from '../../../service/GlobalApi';
import { test, expect, describe, beforeEach } from '@jest/globals';


jest.mock('../../../service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn(),
  PHOTO_REF_URL: 'https://photo.url/{NAME}',
}));

const mockTrip = {
  id: '1',
  location: 'Paris',
  nbOfDays: 3,
  budget: 'Modéré',
  locations: {
    countryName: 'France',
    adminName1: 'Île-de-France',
  },
};

const mockOnDelete = jest.fn();

describe('UserTripCardItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders trip details correctly', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [
          {
            photos: [{ name: 'sample-photo' }],
          },
        ],
      },
    });

    render(
      <Router>
        <UserTripCardItem trip={mockTrip} onDelete={mockOnDelete} />
      </Router>
    );

    expect(screen.getByText('Paris - France')).toBeInTheDocument();
    expect(screen.getByText('3 jours de voyage avec un budget Modéré')).toBeInTheDocument();

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', PHOTO_REF_URL.replace('{NAME}', 'sample-photo'));
    });
  });

  test('calls onDelete when the trip is deleted', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [
          {
            photos: [{ name: 'sample-photo' }],
          },
        ],
      },
    });

    render(
      <Router>
        <UserTripCardItem trip={mockTrip} onDelete={mockOnDelete} />
      </Router>
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    const deleteMenuItem = await screen.findByText('Supprimer');
    fireEvent.click(deleteMenuItem);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTrip.id);
  });

  test('opens and closes the menu when clicking the delete button', async () => {
    GetPlaceDetails.mockResolvedValueOnce({
      data: {
        places: [
          {
            photos: [{ name: 'sample-photo' }],
          },
        ],
      },
    });
  
    render(
      <Router>
        <UserTripCardItem trip={mockTrip} onDelete={mockOnDelete} />
      </Router>
    );
  
    // Attend que le bouton de suppression soit rendu
    const deleteButton = await waitFor(() => screen.getByRole('button'));
    fireEvent.click(deleteButton);
  
    const deleteMenuItem = await screen.findByText('Supprimer');
    expect(deleteMenuItem).toBeInTheDocument();
  
    fireEvent.click(deleteMenuItem);
    await waitFor(() => {
      expect(deleteMenuItem).not.toBeInTheDocument();
    });
  });
  
});
