// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { Edit, Save, Trash, X } from "lucide-react";

// Component pour la modale de mise à jour du profil utilisateur
const UpdateUserDialog = ({ open, onOpenChange, onUpdateSuccess }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Récupération des données de l'utilisateur à partir du localStorage
  useEffect(() => {
    // Si la modale est ouverte, récupérer les données de l'utilisateur à partir du localStorage
    if (open) {
      const userData = JSON.parse(localStorage.getItem("user"));

      // Si les données de l'utilisateur existent, les afficher dans les champs de formulaire
      if (userData && userData.user) {
        const user = userData.user;
        setEmail(user.email || "");

        // Si le nom de l'utilisateur existe, le décomposer en prénom et nom
        if (user.name) {
          const nameParts = user.name.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
        }
      }
    }
  }, [open]);

  // Fonction pour mettre à jour les données de l'utilisateur
  const handleUpdate = async () => {
    // Si les mots de passe ne correspondent pas, afficher un message d'erreur
    if (password !== confirmPassword) {
      toast("Les mots de passe ne correspondent pas");
      return;
    }

    // Récupérer les données de l'utilisateur à partir du localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const updateData = { email, firstName, lastName, password };

      // Envoyer les données de mise à jour à l'API
      const response = await axios.put(
        "http://localhost:5001/api/auth/update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      // Si la réponse de l'API est 200, mettre à jour les données de l'utilisateur dans le localStorage
      if (response.status === 200) {
        const updatedUser = {
          ...userData,
          user: {
            ...userData.user,
            email: response.data.email,
            name: `${response.data.firstName} ${response.data.lastName}`,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onOpenChange(false);
        onUpdateSuccess();
      } else {
        toast("Échec de la mise à jour. Veuillez réessayer.");
      }
    } catch (error) {
      console.log(error);
      toast("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  };

  // Fonction pour supprimer le compte utilisateur
  const handleDelete = async () => {
    // Si l'utilisateur n'est pas sûr de vouloir supprimer son compte, annuler la fonction
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      return;
    }

    // Envoyer la requête de suppression à l'API
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.delete(
        "http://localhost:5001/api/auth/delete",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      // Si la réponse de l'API est 200, supprimer les données de l'utilisateur du localStorage et rediriger vers la page d'accueil
      if (response.status === 200) {
        localStorage.removeItem("user");
        onOpenChange(false);
        window.location.href = "/";
      } else {
        toast("Échec de la suppression. Veuillez réessayer.");
      }
    } catch (error) {
      console.log(error);
      toast("Erreur lors de la suppression. Veuillez réessayer.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="update-description">
        <DialogHeader>
          <DialogClose asChild>
            <button className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
          <DialogTitle className="text-2xl font-bold pb-5">
            <Edit className="inline mr-2" /> Mes informations
          </DialogTitle>
          <DialogDescription />
          <div id="update-description">
            <label htmlFor="firstName">Prénom</label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mb-5 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles améliorés
              disabled={!isEditing}
              data-testid="firstName-input"
            />
            <label htmlFor="lastName">Nom</label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mb-5 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles améliorés
              disabled={!isEditing}
              data-testid="lastName-input"
            />
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-5 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles améliorés
              disabled={!isEditing}
              data-testid="email-input"
            />
            {isEditing && (
              <>
                <label htmlFor="password">Nouveau mot de passe</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-5 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles améliorés
                />
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styles améliorés
                />
              </>
            )}
          </div>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          {isEditing ? (
            <>
              <Button className="w-full mr-2" onClick={handleUpdate}>
                <Save className="mr-1 h-4 w-4" /> Enregistrer les modifications
              </Button>
              <Button
                className="w-full ml-2"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-1 h-4 w-4" /> Annuler les modifications
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full mr-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-1 h-4 w-4" /> Modifier mon profil
              </Button>
              <Button
                className="w-full ml-2"
                onClick={handleDelete}
                variant="destructive"
                data-testid="delete-button"
              >
                <Trash className="mr-1 h-4 w-4" /> Supprimer mon compte
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

UpdateUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default UpdateUserDialog;
