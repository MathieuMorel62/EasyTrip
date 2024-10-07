// eslint-disable-next-line no-unused-vars
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '../input';
import { describe, test, expect, jest } from '@jest/globals';


describe('Composant Input', () => {
  test('Rendu avec les propriétés par défaut', () => {
    render(<Input type="text" placeholder="Entrez du texte" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez du texte/i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('Applique une classe personnalisée', () => {
    render(<Input className="custom-class" />);
    
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('custom-class');
  });

  test('Rendu avec le type password', () => {
    render(<Input type="password" placeholder="Mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/mot de passe/i);
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('Est désactivé lorsque la prop disabled est vraie', () => {
    render(<Input disabled placeholder="Désactivé" />);
    
    const inputElement = screen.getByPlaceholderText(/désactivé/i);
    expect(inputElement).toBeDisabled();
  });

  test('Rendu avec une valeur initiale', () => {
    const handleChange = jest.fn();
    render(<Input type="text" value="Texte initial" onChange={handleChange} />);
    
    const inputElement = screen.getByDisplayValue(/texte initial/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('Appelle la fonction onChange lors de la saisie', () => {
    const handleChange = jest.fn();
    render(<Input type="text" onChange={handleChange} placeholder="Entrez du texte" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez du texte/i);
    fireEvent.change(inputElement, { target: { value: 'Nouveau texte' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: 'Nouveau texte' }) }));
  });
});
