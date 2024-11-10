/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Suite de tests pour le composant Button.
 * Ces tests vérifient le rendu du composant avec différentes propriétés,
 * ainsi que son comportement lors des interactions utilisateur.
 */

// Simulation de la connexion à la base de données MySQL pour éviter les appels réels lors des tests
jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
      connect: jest.fn((cb) => cb(null)),
      query: jest.fn((sql, params, cb) => cb(null, [])),
      end: jest.fn(),
  })),
}));

// Importation des bibliothèques nécessaires pour les tests
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../button';
import { describe, test, expect } from '@jest/globals';


describe('Composant Button', () => {
  
  // Teste le rendu du bouton avec les propriétés par défaut
  test('Rendu avec les propriétés par défaut', () => {
    render(<Button>Default Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /default button/i });
    expect(buttonElement).toBeInTheDocument(); // Vérifie que le bouton est présent dans le document
    expect(buttonElement).toHaveClass('bg-primary text-primary-foreground'); // Vérifie les classes CSS par défaut
  });

  // Teste le rendu du bouton avec une classe personnalisée
  test('Rendu avec une classe personnalisée', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /custom class button/i });
    expect(buttonElement).toHaveClass('custom-class'); // Vérifie que la classe personnalisée est appliquée
  });

  // Teste le rendu du bouton avec une variante destructrice
  test('Rendu avec différentes variantes', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /destructive button/i });
    expect(buttonElement).toHaveClass('bg-destructive text-destructive-foreground'); // Vérifie les classes CSS pour la variante destructrice
  });

  // Teste le rendu du bouton avec une taille large
  test('Rendu avec différentes tailles', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('h-11 rounded-md px-8'); // Vérifie les classes CSS pour la taille large
  });

  // Teste la gestion des événements de clic sur le bouton
  test('gère les événements de clic', () => {
    const handleClick = jest.fn(); // Fonction simulée pour gérer le clic
    render(<Button onClick={handleClick}>Button cliquable</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button cliquable/i });
    fireEvent.click(buttonElement); // Simule un clic sur le bouton
    expect(handleClick).toHaveBeenCalledTimes(1); // Vérifie que la fonction de clic a été appelée une fois
  });

  // Teste que le bouton est désactivé lorsque la prop disabled est vraie
  test('est désactivé lorsque la prop disabled est vraie', () => {
    render(<Button disabled>Button désactivé</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button désactivé/i });
    expect(buttonElement).toBeDisabled(); // Vérifie que le bouton est désactivé
  });
});
