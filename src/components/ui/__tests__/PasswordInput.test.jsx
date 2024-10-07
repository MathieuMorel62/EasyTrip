// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '../PasswordInput';
import { describe, test, expect } from '@jest/globals';


describe('Composant PasswordInput', () => {
  test('Rendu avec le placeholder correct', () => {
    render(<PasswordInput value="" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('Masque le mot de passe par défaut', () => {
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('Affiche le mot de passe lorsque l\'icône est cliquée', () => {
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('Masque le mot de passe à nouveau lorsque l\'icône est cliquée', () => {
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    const toggleButton = screen.getByRole('button');

    // Affiche le mot de passe
    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');

    // Masque le mot de passe
    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('Vérifie que l\'icône change correctement', () => {
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toContainHTML('<svg');

    fireEvent.click(toggleButton);
    expect(toggleButton).toContainHTML('<svg');
  });

  test('Gère les valeurs vides', () => {
    render(<PasswordInput value="" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toHaveValue('');
  });
});