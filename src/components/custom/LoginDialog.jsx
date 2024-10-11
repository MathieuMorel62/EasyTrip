// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaUserPlus } from "react-icons/fa";
import PasswordInput from "@/components/ui/PasswordInput";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import PropTypes from 'prop-types';


// Composant pour la boite de dialogue de connexion
const LoginDialog = ({ open, onOpenChange, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Fonction pour gérer la connexion avec Google
  const login = useGoogleLogin({
    onSuccess: (response) => {
      GetUserProfile(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Fonction pour gérer la connexion avec un email et un mot de passe
  const handleEmailLogin = async () => {
    try {
      const userResponse = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );
      // Si la connexion est réussie, on enregistre l'utilisateur dans le localStorage
      if (userResponse.status === 200) {
        localStorage.setItem("user", JSON.stringify(userResponse.data));
        onOpenChange(false);
        onLoginSuccess();
      } else {
        toast("Utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      console.log(error);
      toast("Erreur lors de la connexion. Veuillez réessayer.");
    }
  };

  // Fonction pour gérer l'inscription d'un nouvel utilisateur
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast("Les mots de passe ne correspondent pas");
      return;
    }
    // On envoie les données du nouvel utilisateur à l'API
    try {
      const signUpResponse = await axios.post(
        "http://localhost:5001/api/auth/signup",
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }
      );

      // Si l'inscription est réussie, on enregistre l'utilisateur dans le localStorage
      if (signUpResponse.status === 201) {
        localStorage.setItem("user", JSON.stringify(signUpResponse.data));
        onOpenChange(false);
        onLoginSuccess();
      } else {
        toast("Échec de l'inscription. Veuillez réessayer.");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          toast(err.msg);
        });
      } else {
        console.log(error);
        toast("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  // Fonction pour récupérer les informations de l'utilisateur à partir de Google
  const GetUserProfile = async (tokenInfo) => {
    try {
      // On récupère les informations de l'utilisateur à partir de Google
      await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      );

      // On envoie les informations de l'utilisateur à l'API
      const serverResponse = await axios.post(
        'http://localhost:5001/api/auth/google-login',
        { token: tokenInfo.access_token }
      );

      // Si la connexion est réussie, on enregistre l'utilisateur dans le localStorage
      localStorage.setItem("user", JSON.stringify(serverResponse.data));
      onOpenChange(false);
      onLoginSuccess();
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
      toast("Erreur lors de la connexion avec Google");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="custom-description">
        <DialogHeader>
          <DialogClose asChild>
            <button className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
          <DialogTitle>
            <img src="/logo-black.svg" alt="logo" className="w-48 ml-[-10px]" />
          </DialogTitle>
          <DialogDescription />
          <div id="custom-description">
            <h2 className="font-bold text-lg mt-2 mb-2 flex gap-2">
              {isSignUp ? "Créer un compte" : "Se connecter avec"}
              {!isSignUp && <img src="/name-google.svg" className="w-16" />}
            </h2>
            <p>
              {isSignUp
                ? "Créez un compte pour commencer à planifier vos voyages."
                : "Se connecter avec l'authentification Google ou utiliser votre email."}
            </p>
            {!isSignUp && (
              <>
                <Button
                  className="w-full mt-5 flex gap-2 items-center"
                  onClick={login}
                >
                  <FcGoogle className="h-5 w-5" />
                  Connexion avec Google
                </Button>
                <p className="mt-10 text-sm text-gray-600">
                  Si vous n&lsquo;avez pas de compte Google, vous pouvez
                  utiliser la connexion classique ci-dessous.
                </p>
              </>
            )}
            <div className="mt-5">
              {isSignUp && (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full"
                    data-testid="signup-firstname"
                  />
                  <Input
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full"
                    data-testid="signup-lastname"
                  />
                </div>
              )}
              <div className={`flex gap-2 ${isSignUp ? "mt-4" : "mt-5"}`}>
                {!isSignUp && (
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    data-testid={isSignUp ? "signup-email" : "login-email"}
                  />
                )}
                <PasswordInput
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid={isSignUp ? "signup-password" : "login-password"}
                />
                {isSignUp && (
                  <PasswordInput
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="signup-confirm-password"
                  />
                )}
              </div>
              {isSignUp && (
                <div className={`flex gap-2 ${isSignUp ? "mt-4" : "mt-5"}`}>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    data-testid={isSignUp ? "signup-email" : "login-email"}
                  />
                </div>
              )}
              <Button
                className="w-full mt-5 gap-2"
                onClick={isSignUp ? handleSignUp : handleEmailLogin}
              >
                <FaUserPlus className="w-5 h-5" />
                {isSignUp ? "Créer un compte" : "Connexion avec Email"}
              </Button>
            </div>
            <div className="mt-5 text-center">
              {isSignUp ? (
                <p>
                  Vous avez déjà un compte ?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsSignUp(false)}
                  >
                    Connectez-vous ici
                  </span>
                  .
                </p>
              ) : (
                <p>
                  Vous n&lsquo;avez pas de compte ?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsSignUp(true)}
                    data-testid="signup-link"
                  >
                    Inscrivez-vous ici
                  </span>
                  .
                </p>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

LoginDialog.propTypes = { // Ajoutez cette section à la fin du fichier
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginDialog;
