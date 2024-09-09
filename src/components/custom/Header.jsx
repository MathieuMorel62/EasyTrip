import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import LoginDialog from "../custom/LoginDialog";
import UpdateUserDialog from "../custom/UpdateUserDialog";
import { FiLogOut, FiUser } from "react-icons/fi";

// Composant pour l'en-tête de la page
function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

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
        <img src="/logo.svg" className="w-44 h-15" />
      </a>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button
                variant="outline"
                className="rounded-full h-[45px] bg-black text-white hover:bg-[#f56551] hover:text-white border-solid border-[0.2rem] border-[#f56551] font-semibold"
              >
                Créer un Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button
                variant="outline"
                className="rounded-full h-[45px] bg-black text-white hover:bg-[#f56551] hover:text-white border-solid border-[0.2rem] border-[#f56551] font-semibold"
              >
                Mes Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <span className="text-white hover:bg-black bg-[#f56551] p-5 rounded-full border-solid border-[0.2rem] border-[#f56551] h-[35px] w-[35px] flex items-center justify-center text-lg font-semibold">
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
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              className="hover:bg-[#f56551] hover:text-white border-solid border-[0.2rem] border-[#f56551] cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              Connexion
            </Button>
          </div>
        )}
      </div>
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
