// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { describe, expect, test } from '@jest/globals';


describe('Footer', () => {
  test('renders footer with correct text', () => {
    render(<Footer />);
    const footerText = screen.getByText(/EasyTrip © 2024 - Tous droits réservés/i);
    expect(footerText).toBeInTheDocument();
  });
});
