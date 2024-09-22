import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginDialog from "../LoginDialog";
import axios from "axios";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock("axios");

describe("LoginDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    // Mock de la réponse de l'API pour la connexion
    axios.post.mockResolvedValueOnce({ status: 200, data: { /* données utilisateur */ } });
    // Mock de la réponse de l'API pour l'inscription
    axios.post.mockResolvedValueOnce({ status: 201, data: { /* données utilisateur */ } });
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog open={true} onOpenChange={mockOnOpenChange} onLoginSuccess={mockOnLoginSuccess} />
      </GoogleOAuthProvider>
    );
  });

  test("affiche le titre de connexion", () => {
    const connectTextElements = screen.getAllByText(/Se connecter avec/i);
    expect(connectTextElements.length).toBeGreaterThan(0); // Vérifie qu'il y a au moins un élément
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
  });

  test("test le champ email", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Connexion avec Email/i));
  });

  test("test le bouton d'inscription", () => {
    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    const createAccountElements = screen.getAllByText(/Créer un compte/i);
    expect(createAccountElements.length).toBeGreaterThan(0); // Vérifie qu'il y a au moins un élément
  });

  test("test l'inscription d'un nouvel utilisateur", async () => {
    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), { target: { value: "John" } });

    const nomInputs = screen.getAllByPlaceholderText(/Nom/i);
    fireEvent.change(nomInputs[0], { target: { value: "Doe" } }); // Sélectionne le premier champ "Nom"

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john.doe@example.com" } });

    const passwordInputs = screen.getAllByPlaceholderText(/Mot de passe/i);
    fireEvent.change(passwordInputs[0], { target: { value: "password" } }); // Sélectionne le premier champ "Mot de passe"

    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), { target: { value: "password" } });

    const createAccountButtons = screen.getAllByText(/Créer un compte/i);
    fireEvent.click(createAccountButtons[0]); // Sélectionne le premier bouton "Créer un compte"
  });

  test("test l'affichage du formulaire d'inscription", () => {
    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    expect(screen.getByPlaceholderText(/Prénom/i)).toBeInTheDocument();

    // Utilisez getAllByPlaceholderText pour récupérer tous les éléments "Nom"
    const nomInputs = screen.getAllByPlaceholderText(/Nom/i);
    expect(nomInputs.length).toBeGreaterThan(0); // Vérifie qu'il y a au moins un champ "Nom"
    // Vérifiez que le premier champ "Nom" est dans le document
    expect(nomInputs[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirmer le mot de passe/i)).toBeInTheDocument();
  });

  test("test la fonction de connexion avec un email et un mot de passe", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Connexion avec Email/i));
    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });

  test("test la fonction de connexion avec Google", async () => {
    fireEvent.click(screen.getByText(/Connexion avec Google/i));
  });
});
