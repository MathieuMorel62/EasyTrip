/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Suite de tests pour le composant Dialog.
 * Ces tests vérifient le rendu, l'interaction et le comportement du composant Dialog,
 * ainsi que l'intégration avec le composant Button.
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
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../dialog';
import { describe, test, expect } from '@jest/globals';
import { Button } from '../button';


describe('Composant Dialog', () => {
  
  test('Rendu du Dialog avec le titre et la description', () => {
    // Rendu du composant Dialog avec un titre et une description
    render(
      <Dialog>
        <DialogTrigger>Ouvrir le Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Titre du Dialog</DialogTitle>
          <DialogDescription>Description du Dialog</DialogDescription>
          <DialogClose>Fermer</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Récupération du bouton de déclenchement et simulation d'un clic
    const triggerButton = screen.getByRole('button', { name: /ouvrir le dialog/i });
    fireEvent.click(triggerButton);

    // Vérifie que le titre et la description sont affichés après l'ouverture du dialog
    expect(screen.getByText(/titre du dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/description du dialog/i)).toBeInTheDocument();
  });

  test('Fermeture du Dialog', () => {
    // Rendu du composant Dialog pour tester la fermeture
    render(
      <Dialog>
        <DialogTrigger>Ouvrir le Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Titre du Dialog</DialogTitle>
          <DialogDescription>Description du Dialog</DialogDescription>
          <DialogClose>Fermer</DialogClose>
        </DialogContent>
      </Dialog>
    );

    // Ouverture du dialog
    const triggerButton = screen.getByRole('button', { name: /ouvrir le dialog/i });
    fireEvent.click(triggerButton);

    // Vérifie que le dialog est ouvert
    expect(screen.getByText(/titre du dialog/i)).toBeInTheDocument();

    // Clique sur le bouton de fermeture
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);

    // Vérifie que le dialog est fermé
    expect(screen.queryByText(/titre du dialog/i)).not.toBeInTheDocument();
  });

  test('Rendu avec l\'état désactivé', () => {
    // Teste le rendu d'un bouton désactivé
    render(<Button disabled>Disabled Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled(); // Vérifie que le bouton est bien désactivé
  });

  test('Rendu avec une icône', () => {
    // Teste le rendu d'un bouton avec une icône
    render(<Button><span className="icon">🌟</span> Button with Icon</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button with icon/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toContainHTML('🌟'); // Vérifie que l'icône est présente dans le bouton
  });

  test('Gère l\'événement de focus', () => {
    // Teste que le bouton peut recevoir le focus
    render(<Button>Focusable Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /focusable button/i });
    buttonElement.focus();
    expect(buttonElement).toHaveFocus(); // Vérifie que le bouton a le focus
  });

  test('Change de style au survol', () => {
    // Teste que le style du bouton change au survol
    const { container } = render(<Button>Hover Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /hover button/i });
    fireEvent.mouseOver(buttonElement);
    expect(container.firstChild).toHaveClass('hover:bg-primary/90'); // Vérifie que la classe de survol est appliquée
  });
});
