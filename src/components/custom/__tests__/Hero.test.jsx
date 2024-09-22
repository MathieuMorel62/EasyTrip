import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';
import { BrowserRouter } from 'react-router-dom';

import { describe, test, expect } from '@jest/globals';

describe('Hero Component', () => {
  test('Affichage du composant Hero avec le titre et le sous-titre', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    
    // Vérifie si le titre principal est présent
    const titleElement = screen.getByText(/Bienvenue sur/i);
    expect(titleElement).toBeInTheDocument();

    // Vérifie si le sous-titre est présent
    const subtitleElement = screen.getByText(/La plateforme ultime pour créer vos roadtrips par IA/i);
    expect(subtitleElement).toBeInTheDocument();

    // Vérifie si le bouton est présent
    const buttonElement = screen.getByRole('button', { name: /Explorez Maintenant/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('Affichage des images dans le composant Hero', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );

    // Vérifie si les images sont présentes
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0); // Vérifie qu'il y a au moins une image
  });

  test('Affichage des images spécifiques dans le composant Hero', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );

    // Vérifie si une image spécifique est présente
    const image1 = screen.getByAltText(/Voyage montagne/i);
    expect(image1).toBeInTheDocument();

    const image2 = screen.getByAltText(/Voyage nature/i);
    expect(image2).toBeInTheDocument();
  });

  test('Redirection du bouton vers la page de création de trip', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );

    // Vérifie si le bouton redirige vers la bonne page
    const buttonElement = screen.getByRole('button', { name: /Explorez Maintenant/i });
    expect(buttonElement.closest('a')).toHaveAttribute('href', '/create-trip');
  });
});
