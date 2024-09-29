// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from '../Header';

import { test, expect } from '@jest/globals';

test('affiche le logo et le bouton de connexion', () => {
  render(
    <GoogleOAuthProvider clientId="votre-client-id-google">
      <Header />
    </GoogleOAuthProvider>
  );
  const logo = screen.getByAltText(/logo/i);
  expect(logo).toBeInTheDocument();
});

test('affiche le bouton de connexion lorsque l\'utilisateur n\'est pas connecté', () => {
  render(
    <GoogleOAuthProvider clientId="votre-client-id-google">
      <Header />
    </GoogleOAuthProvider>
  );
  const loginButton = screen.getByText(/connexion/i);
  expect(loginButton).toBeInTheDocument();
});

test('affiche les boutons spécifiques à l\'utilisateur connecté', () => {
  // Simuler un utilisateur connecté
  localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));
  render(
    <GoogleOAuthProvider clientId="votre-client-id-google">
      <Header />
    </GoogleOAuthProvider>
  );
  const createTripButton = screen.getByText(/Créer un trip/i);
  const myTripsButton = screen.getByText(/Mes trips/i);
  expect(createTripButton).toBeInTheDocument();
  expect(myTripsButton).toBeInTheDocument();
});

test('handleLogout déconnecte l\'utilisateur et redirige vers la page d\'accueil', () => {
  // Simuler un utilisateur connecté
  localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));
  
  // Espérer que la redirection se produise
  delete window.location;
  window.location = { href: '' };

  render(
    <GoogleOAuthProvider clientId="votre-client-id-google">
      <Header />
    </GoogleOAuthProvider>
  );

  // Cliquer sur le bouton de déconnexion
  const profileButton = screen.getByText(/TU/i); // Utilisez les initiales de l'utilisateur
  fireEvent.click(profileButton);
  const logoutButton = screen.getByText(/Déconnexion/i);
  fireEvent.click(logoutButton);

  // Vérifier que l'utilisateur est déconnecté
  expect(localStorage.getItem('user')).toBeNull();

  // Vérifier que la redirection a eu lieu
  expect(window.location.href).toBe('/');
});

test('affiche les initiales de l\'utilisateur connecté', () => {
  // Simuler un utilisateur connecté avec un nom
  localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));

  render(
    <GoogleOAuthProvider clientId="votre-client-id-google">
      <Header />
    </GoogleOAuthProvider>
  );

  // Vérifier que les initiales sont affichées
  const initials = screen.getByText(/TU/i); // "TU" pour "Test User"
  expect(initials).toBeInTheDocument();
});
