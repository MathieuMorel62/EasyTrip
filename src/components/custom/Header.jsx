// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import LoginDialog from "../custom/LoginDialog";
import UpdateUserDialog from "../custom/UpdateUserDialog";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";

// Composant pour l'en-tête de la page
function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Récupérer les données de l'utilisateur à partir du localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Calculer les initiales de l'utilisateur
  const initials =
    user && user.user && user.user.name
      ? user.user.name
          .split(" ")
          .map((name) => name.charAt(0).toUpperCase())
          .join("")
      : "";

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="w-full fixed z-20 p-3 shadow-sm flex justify-between items-center px-5 bg-black">
      <a href="/" className="w-44 h-15">
        <img src="/logo.svg" className="w-44 h-15" alt="logo" />
      </a>

      {/* Bouton hamburger pour le mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
          aria-label="menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menu principal (pour les écrans moyens et grands) */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <a href="/create-trip">
              <Button
                className="relative p-[0.17rem] bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500"
              >
                <span className="bg-black block p-2 rounded-md bg-clip-padding transition-all duration-300 hover:bg-transparent hover:text-white">
                  <span className="mr-1 text-md">+</span>Créer un trip
                </span>
              </Button>
            </a>

            <a href="/my-trips">
              <Button
                className="relative p-[0.17rem] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
              >
                <span className="bg-black block p-2 rounded-md bg-clip-padding transition-all duration-300 hover:bg-transparent hover:text-white">
                  Mes trips
                </span>
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <span className="text-white bg-gradient-to-r from-purple-600 to-blue-500 p-5 rounded-full h-[35px] w-[35px] flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600">
                  {initials}
                </span>
              </PopoverTrigger>
              <PopoverContent className="cursor-pointer">
                <div
                  onClick={() => setOpenUpdateDialog(true)}
                  className="mb-2 flex items-center"
                >
                  <FiUser className="mr-2" /> Mon profil
                </div>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center"
                >
                  <FiLogOut className="mr-2" /> Déconnexion
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button
            className="relative p-[0.2rem] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
            onClick={() => setOpenDialog(true)}
          >
            <span className="bg-black block p-2 rounded-md bg-clip-padding transition-all duration-300 hover:bg-transparent hover:text-white">
              Connexion
            </span>
          </Button>
        )}
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white md:hidden flex flex-col items-center gap-3 py-5 z-10" data-testid="mobile-menu">
          {user ? (
            <>
              <a href="/create-trip" className="text-white" data-testid="mobile-create-trip">
                Créer un Trip
              </a>
              <a href="/my-trips" className="text-white">
                Mes Trips
              </a>
              <div
                onClick={() => setOpenUpdateDialog(true)}
                className="flex items-center cursor-pointer"
              >
                <FiUser className="mr-2" /> Mon profil
              </div>
              <div
                onClick={handleLogout}
                className="flex items-center cursor-pointer"
              >
                <FiLogOut className="mr-2" /> Déconnexion
              </div>
            </>
          ) : (
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2"
              onClick={() => setOpenDialog(true)}
            >
              Connexion
            </Button>
          )}
        </div>
      )}

      <LoginDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onLoginSuccess={() => window.location.reload()}
      />
      <UpdateUserDialog
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        onUpdateSuccess={() => window.location.reload()}
      />
    </div>
  );
}

export default Header;
