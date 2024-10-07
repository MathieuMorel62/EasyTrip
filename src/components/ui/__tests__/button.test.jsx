// eslint-disable-next-line no-unused-vars
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../button';
import { describe, test, expect, jest } from '@jest/globals';


describe('Composant Button', () => {
  test('Rendu avec les propriétés par défaut', () => {
    render(<Button>Default Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /default button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary text-primary-foreground');
  });

  test('Rendu avec une classe personnalisée', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /custom class button/i });
    expect(buttonElement).toHaveClass('custom-class');
  });

  test('Rendu avec différentes variantes', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /destructive button/i });
    expect(buttonElement).toHaveClass('bg-destructive text-destructive-foreground');
  });

  test('Rendu avec différentes tailles', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('h-11 rounded-md px-8');
  });

  test('gère les événements de clic', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Button cliquable</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button cliquable/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('est désactivé lorsque la prop disabled est vraie', () => {
    render(<Button disabled>Button désactivé</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /button désactivé/i });
    expect(buttonElement).toBeDisabled();
  });
});
