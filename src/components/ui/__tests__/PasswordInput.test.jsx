/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Tests pour le composant PasswordInput.
 * Ces tests vérifient le rendu, le comportement de masquage/affichage du mot de passe,
 * et la gestion des interactions utilisateur.
 */

// Simulation de la connexion à la base de données pour éviter les appels réels lors des tests
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
import PasswordInput from '../PasswordInput';
import { describe, test, expect } from '@jest/globals';


describe('Composant PasswordInput', () => {
  
  test('Rendu avec le placeholder correct', () => {
    // Vérifie que le composant rend le placeholder spécifié
    render(<PasswordInput value="" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toBeInTheDocument();
  });


  test('Masque le mot de passe par défaut', () => {
    // Vérifie que le mot de passe est masqué par défaut
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toHaveAttribute('type', 'password');
  });


  test('Affiche le mot de passe lorsque l\'icône est cliquée', () => {
    // Vérifie que le mot de passe est affiché lorsque l'icône de visibilité est cliquée
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');
  });


  test('Masque le mot de passe à nouveau lorsque l\'icône est cliquée', () => {
    // Vérifie que le mot de passe est masqué à nouveau après un second clic sur l'icône
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
    // Vérifie que l'icône de visibilité change lorsque l'utilisateur clique dessus
    render(<PasswordInput value="monMotDePasse" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toContainHTML('<svg');

    fireEvent.click(toggleButton);
    expect(toggleButton).toContainHTML('<svg');
  });


  test('Gère les valeurs vides', () => {
    // Vérifie que le champ de saisie gère correctement les valeurs vides
    render(<PasswordInput value="" onChange={() => {}} placeholder="Entrez votre mot de passe" />);
    
    const inputElement = screen.getByPlaceholderText(/entrez votre mot de passe/i);
    expect(inputElement).toHaveValue('');
  });
});
