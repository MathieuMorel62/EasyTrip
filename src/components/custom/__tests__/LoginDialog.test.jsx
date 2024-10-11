/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginDialog from "../LoginDialog";
import axios from "axios";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("LoginDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.clearAllMocks();
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        /* données utilisateur */
      },
    });
  });

  test("affiche le titre de connexion", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    const connectTextElements = screen.getAllByText(/Se connecter avec/i);
    expect(connectTextElements.length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
  });

  test("test le champ email", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText(/Connexion avec Email/i));
  });

  test("test le bouton d'inscription", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    const createAccountElements = screen.getAllByText(/Créer un compte/i);
    expect(createAccountElements.length).toBeGreaterThan(0);
  });

  test("test l'inscription d'un nouvel utilisateur", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "John" },
    });

    const nomInputs = screen.getAllByPlaceholderText(/Nom/i);
    fireEvent.change(nomInputs[0], { target: { value: "Doe" } });

    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "john.doe@example.com" },
    });

    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password" },
    });

    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password" },
    });

    // Cible le bouton "Créer un compte" spécifique
    const createAccountButton = screen.getByRole("button", {
      name: /Créer un compte/i,
    });
    fireEvent.click(createAccountButton);
  });

  test("test l'affichage du formulaire d'inscription", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));
    expect(screen.getByPlaceholderText(/Prénom/i)).toBeInTheDocument();

    const nomInputs = screen.getAllByPlaceholderText(/Nom/i);
    expect(nomInputs.length).toBeGreaterThan(0);
    expect(nomInputs[0]).toBeInTheDocument();
    expect(screen.getByTestId("signup-confirm-password")).toBeInTheDocument();
  });

  test("test la fonction de connexion avec un email et un mot de passe", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "password" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Connexion avec Email/i));
    });

    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });

  test("affiche une erreur lors de la connexion avec des identifiants invalides", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByTestId("login-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "wrongpassword" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Connexion avec Email/i));
    });

    expect(toast).toHaveBeenCalledWith(
      "Erreur lors de la connexion. Veuillez réessayer."
    );
  });

  test("test la fonction de connexion avec Google", () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Connexion avec Google/i));
  });

  test("affiche des erreurs de validation pour les champs d'inscription manquants ou invalides", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            { msg: "Le prénom est obligatoire" },
            { msg: "Le nom est obligatoire" },
            { msg: "Email invalide" },
          ],
        },
      },
    });

    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={() => {}}
          onLoginSuccess={() => {}}
        />
      </GoogleOAuthProvider>
    );

    await userEvent.click(screen.getByTestId("signup-link"));

    const createAccountButton = await screen.findByRole("button", {
      name: /Créer un compte/i,
    });

    await userEvent.click(createAccountButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Le prénom est obligatoire");
      expect(toast).toHaveBeenCalledWith("Le nom est obligatoire");
      expect(toast).toHaveBeenCalledWith("Email invalide");
    });
  });

  test("affiche une erreur lorsque les mots de passe ne correspondent pas lors de l'inscription", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));

    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Nom/i)[0], {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password1" },
    });
    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password2" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Créer un compte/i }));
    });

    expect(toast).toHaveBeenCalledWith(
      "Les mots de passe ne correspondent pas"
    );
  });

  test("affiche une erreur lorsque les mots de passe ne correspondent pas lors de l'inscription", async () => {
    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));

    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Nom/i)[0], {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password1" },
    });
    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password2" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Créer un compte/i }));
    });

    expect(toast).toHaveBeenCalledWith(
      "Les mots de passe ne correspondent pas"
    );
  });

  test("affiche une erreur générale lorsque l'inscription échoue sans erreurs spécifiques", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    console.log = jest.fn();

    render(
      <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <LoginDialog
          open={true}
          onOpenChange={() => {}}
          onLoginSuccess={() => {}}
        />
      </GoogleOAuthProvider>
    );

    fireEvent.click(screen.getByText(/Inscrivez-vous ici/i));

    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Nom/i)[0], {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Créer un compte/i }));
    });

    expect(console.log).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      "Erreur lors de l'inscription. Veuillez réessayer."
    );
  });
});
