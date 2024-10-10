// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from '../Header';
import { test, expect, beforeEach, describe } from '@jest/globals';

beforeEach(() => {
  localStorage.clear();
});

describe('Header component', () => {
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
    // Simule un utilisateur connecté
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
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));

    // Espère que la redirection se produise
    delete window.location;
    window.location = { href: '' };

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Clique sur le bouton de déconnexion
    const profileButton = screen.getByText(/TU/i);
    fireEvent.click(profileButton);
    const logoutButton = screen.getByText(/Déconnexion/i);
    fireEvent.click(logoutButton);

    // Vérifie que l'utilisateur est déconnecté
    expect(localStorage.getItem('user')).toBeNull();

    // Vérifie que la redirection a eu lieu
    expect(window.location.href).toBe('/');
  });

  test('affiche les initiales de l\'utilisateur connecté', () => {
    // Simule un utilisateur connecté avec un nom
    localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Vérifie que les initiales sont affichées
    const initials = screen.getByText(/TU/i);
    expect(initials).toBeInTheDocument();
  });

  test('le logo redirige vers la page d\'accueil lorsqu\'il est cliqué', () => {
    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );
    const logo = screen.getByAltText(/logo/i);
    fireEvent.click(logo);
    expect(window.location.href).toBe('/');
  });

  test('affiche le menu mobile lorsque le bouton hamburger est cliqué', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Clique sur le bouton hamburger
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    // Vérifie que le menu mobile est affiché
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();

    const createTripLink = screen.getByTestId('mobile-create-trip');
    expect(createTripLink).toBeInTheDocument();
  });

  test('cache le menu mobile lorsque le bouton hamburger est cliqué à nouveau', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'Test User' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Clique sur le bouton hamburger pour ouvrir le menu
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    // Clique à nouveau sur le bouton hamburger pour fermer le menu
    fireEvent.click(menuButton);

    // Vérifie que le menu mobile n'est plus affiché
    const mobileMenu = screen.queryByTestId('mobile-menu');
    expect(mobileMenu).not.toBeInTheDocument();
  });

  test('affiche le dialogue de connexion lorsque le bouton de connexion est cliqué', () => {
    // Assure que l'utilisateur n'est pas connecté
    localStorage.removeItem('user');

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Clique sur le bouton de connexion
    const loginButton = screen.getByText(/connexion/i);
    fireEvent.click(loginButton);

    // Vérifie que le dialogue de connexion est ouvert
    const loginDialog = screen.getByRole('dialog');
    expect(loginDialog).toBeInTheDocument();
  });

  test('affiche le Popover avec les initiales de l\'utilisateur connecté', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'John Doe' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Vérifie que le Popover avec les initiales est affiché
    const initials = screen.getByText(/JD/i); // Utilisateur "John Doe" donne les initiales "JD"
    expect(initials).toBeInTheDocument();
  });

  test('ouvre le dialogue de mise à jour de l\'utilisateur lorsque "Mon profil" est cliqué', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'John Doe' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Ouvre le menu Popover
    const initials = screen.getByText(/JD/i);
    fireEvent.click(initials);

    // Clique sur "Mon profil"
    const profileOption = screen.getByText(/Mon profil/i);
    fireEvent.click(profileOption);

    // Vérifie que le dialogue UpdateUserDialog est ouvert
    const updateUserDialog = screen.getByRole('dialog');
    expect(updateUserDialog).toBeInTheDocument();
  });

  test('affiche le menu mobile avec les options de l\'utilisateur connecté', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'John Doe' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Clique sur le bouton hamburger pour ouvrir le menu mobile
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    // Récupère le conteneur du menu mobile
    const mobileMenu = screen.getByTestId('mobile-menu');

    // Vérifie que les options du menu mobile sont affichées
    const createTripOption = within(mobileMenu).getByText(/Créer un Trip/i);
    const myTripsOption = within(mobileMenu).getByText(/Mes Trips/i);

    expect(createTripOption).toBeInTheDocument();
    expect(myTripsOption).toBeInTheDocument();
  });

  test('ouvre le dialogue UpdateUserDialog lorsque "Mon profil" est cliqué dans le menu mobile', () => {
    // Simule un utilisateur connecté
    localStorage.setItem('user', JSON.stringify({ user: { name: 'John Doe' } }));

    render(
      <GoogleOAuthProvider clientId="votre-client-id-google">
        <Header />
      </GoogleOAuthProvider>
    );

    // Ouvre le menu mobile en cliquant sur le bouton hamburger
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    // Clique sur "Mon profil" dans le menu mobile
    const profileOption = within(screen.getByTestId('mobile-menu')).getByText(/Mon profil/i);
    fireEvent.click(profileOption);

    // Vérifie que le dialogue UpdateUserDialog est ouvert
    const updateUserDialog = screen.getByRole('dialog');
    expect(updateUserDialog).toBeInTheDocument();
  });
});
