// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "../popover";
import { describe, test, expect } from "@jest/globals";


describe("Composant Popover", () => {
  test("Rendu du Popover avec le contenu correct", () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span>Ouvrir Popover</span>
        </PopoverTrigger>
        <PopoverContent>
          <p>Contenu du popover</p>
          <PopoverClose asChild>
            <button>Fermer</button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );

    // Vérifie que le bouton de déclenchement est présent
    const triggerButton = screen.getByRole("button", {
      name: /ouvrir popover/i,
    });
    expect(triggerButton).toBeInTheDocument();

    // Clique sur le bouton pour ouvrir le popover
    fireEvent.click(triggerButton);

    // Vérifie que le contenu du popover est maintenant visible
    expect(screen.getByText(/contenu du popover/i)).toBeInTheDocument();

    // Vérifie que le bouton de fermeture est présent
    const closeButton = screen.getByRole("button", { name: /fermer/i });
    expect(closeButton).toBeInTheDocument();

    // Clique sur le bouton de fermeture
    fireEvent.click(closeButton);

    // Vérifie que le contenu du popover n'est plus visible
    expect(screen.queryByText(/contenu du popover/i)).not.toBeInTheDocument();
  });

  test("Le Popover ne s'ouvre pas par défaut", () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span>Ouvrir Popover</span>
        </PopoverTrigger>
        <PopoverContent>
          <p>Contenu du popover</p>
          <PopoverClose asChild>
            <button>Fermer</button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );
  
    // Vérifie que le contenu du popover n'est pas présent initialement
    expect(screen.queryByText(/contenu du popover/i)).not.toBeInTheDocument();
  });

  test("Le Popover se ferme lorsqu'on appuie sur la touche Échap", async () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span>Ouvrir Popover</span>
        </PopoverTrigger>
        <PopoverContent>
          <p>Contenu du popover</p>
          <PopoverClose asChild>
            <button>Fermer</button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );
  
    const triggerButton = screen.getByRole("button", { name: /ouvrir popover/i });
    fireEvent.click(triggerButton);
  
    expect(await screen.findByText(/contenu du popover/i)).toBeInTheDocument();
  
    // Simuler l'appui sur la touche Échap
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
  
    await waitFor(() => {
      expect(screen.queryByText(/contenu du popover/i)).not.toBeInTheDocument();
    });
  });
});
