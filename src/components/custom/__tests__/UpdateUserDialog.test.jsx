// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateUserDialog from "../UpdateUserDialog";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterEach,
} from "@jest/globals";
import axios from "axios";
import { toast } from "sonner";

// Mock des modules externes
jest.mock("axios");
jest.mock("sonner");

beforeAll(() => {
  window.confirm = jest.fn(() => true);
  delete window.location;
  window.location = { href: "" };
});

describe("UpdateUserDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnUpdateSuccess = jest.fn();

  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        user: { email: "test@example.com", name: "Test User" },
        token: "mockToken",
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("test le titre de la page", () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );
    expect(screen.getByText(/Mes informations/i)).toBeInTheDocument();
  });

  test("test le bouton modifier mon profil", async () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    const editButton = screen.getByText(/Modifier mon profil/i);
    fireEvent.click(editButton);

    // Vérifie que les champs de saisie sont activés
    const firstNameInputs = screen.getAllByLabelText(/Prénom/i);
    const lastNameInputs = screen.getAllByLabelText(/Nom/i);
    const emailInputs = screen.getAllByLabelText(/Email/i);

    // Sélection du premier élément (si c'est le cas)
    expect(firstNameInputs[0]).not.toBeDisabled();
    expect(lastNameInputs[0]).not.toBeDisabled();
    expect(emailInputs[0]).not.toBeDisabled();
  });

  test("test le bouton de fermeture de la modale", async () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    // Clique sur le bouton de fermeture
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));

    // Vérifie que la fonction onOpenChange a été appelée avec false
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  test("test le bouton d'enregistrement des modifications", async () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    // Utilisation de getByTestId pour cibler les champs
    const firstNameInput = screen.getByTestId("firstName-input");
    const lastNameInput = screen.getByTestId("lastName-input");
    const emailInput = screen.getByTestId("email-input");

    await waitFor(() => {
      expect(firstNameInput.value).toBe("Test");
      expect(lastNameInput.value).toBe("User");
      expect(emailInput.value).toBe("test@example.com");
    });
  });

  test("test le message d'erreur si les mots de passe ne correspondent pas", async () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    fireEvent.click(screen.getByText(/Modifier mon profil/i));

    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "differentPassword" },
    });

    fireEvent.click(screen.getByText(/Enregistrer les modifications/i));

    // Vérifie que le toast est affiché avec le message d'erreur
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Les mots de passe ne correspondent pas"
      );
    });

    // Vérifie que l'API n'a pas été appelée
    expect(axios.put).not.toHaveBeenCalled();
  });

  test("test la suppression du compte utilisateur", async () => {
    // Mock la réponse de l'API de suppression
    axios.delete.mockResolvedValue({ status: 200 });

    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    // Récupère le bouton de suppression sans passer en mode édition
    const deleteButton = screen.getByTestId("delete-button");

    // Clique sur le bouton de suppression
    fireEvent.click(deleteButton);

    // Vérifie que l'API de suppression a été appelée
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5001/api/auth/delete",
        {
          headers: { Authorization: "Bearer mockToken" },
        }
      );
    });

    // Vérifie que l'utilisateur est redirigé vers la page d'accueil
    expect(window.location.href).toBe("/");
  });

  test("test le bouton modifier mon profil", async () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    const editButton = screen.getByText(/Modifier mon profil/i);
    fireEvent.click(editButton);

    // Vérifie que les champs de saisie sont activés en utilisant getByTestId
    const firstNameInput = screen.getByTestId("firstName-input");
    const lastNameInput = screen.getByTestId("lastName-input");
    const emailInput = screen.getByTestId("email-input");

    // Vérifie que les champs ne sont plus désactivés
    expect(firstNameInput).not.toBeDisabled();
    expect(lastNameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
  });

  test("mise à jour échouée de l'utilisateur", async () => {
    axios.put.mockResolvedValue({
      status: 400,
    });

    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );

    fireEvent.click(screen.getByText(/Modifier mon profil/i));

    fireEvent.change(screen.getByTestId("firstName-input"), {
      target: { value: "Updated" },
    });
    fireEvent.change(screen.getByTestId("lastName-input"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "updated@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByText(/Enregistrer les modifications/i));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Échec de la mise à jour. Veuillez réessayer."
      );
    });

    expect(mockOnOpenChange).not.toHaveBeenCalled();
    expect(mockOnUpdateSuccess).not.toHaveBeenCalled();
  });

  test("changement des boutons en fonction de isEditing", () => {
    render(
      <UpdateUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateSuccess={mockOnUpdateSuccess}
      />
    );
  
    // Vérifier les boutons en mode non-édition
    expect(screen.getByText(/Modifier mon profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Supprimer mon compte/i)).toBeInTheDocument();
  
    // Activer le mode édition
    fireEvent.click(screen.getByText(/Modifier mon profil/i));
  
    // Vérifier les boutons en mode édition
    expect(
      screen.getByText(/Enregistrer les modifications/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Annuler les modifications/i)).toBeInTheDocument();
  });
  
});
