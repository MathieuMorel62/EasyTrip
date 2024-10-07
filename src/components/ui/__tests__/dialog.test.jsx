// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../dialog';
import { describe, test, expect } from '@jest/globals';
import { Button } from '../button';

describe('Composant Dialog', () => {
  test('Rendu du Dialog avec le titre et la description', () => {
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

    const triggerButton = screen.getByRole('button', { name: /ouvrir le dialog/i });
    fireEvent.click(triggerButton);

    // Vérifie que le titre et la description sont affichés
    expect(screen.getByText(/titre du dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/description du dialog/i)).toBeInTheDocument();
  });

  test('Fermeture du Dialog', () => {
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
    render(<Button disabled>Disabled Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });

  test('Rendu avec une icône', () => {
    render(<Button><span className="icon">🌟</span> Button with Icon</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button with icon/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toContainHTML('🌟');
  });

  test('Gère l\'événement de focus', () => {
    render(<Button>Focusable Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /focusable button/i });
    buttonElement.focus();
    expect(buttonElement).toHaveFocus();
  });

  test('Change de style au survol', () => {
    const { container } = render(<Button>Hover Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /hover button/i });
    fireEvent.mouseOver(buttonElement);
    expect(container.firstChild).toHaveClass('hover:bg-primary/90');
  });
});
