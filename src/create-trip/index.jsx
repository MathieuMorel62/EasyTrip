import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AiModel";
import axios from "axios";
import AutocompleteSearch from "@/components/api/AutocompleteSearch.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import LoginDialog from "../components/custom/LoginDialog";

// Composant principal pour créer un voyage
function CreateTrip() {
  // Déclaration des états
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Effet pour surveiller les changements de formData
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Fonction pour générer un voyage
  const OnGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Si l'utilisateur n'est pas connecté, on ouvre la boite de dialogue de connexion
    if (!user) {
      setOpenDialog(true);
      return;
    }

    // Si l'utilisateur est connecté, on vérifie que tous les champs obligatoires sont remplis
    if (
      !formData?.location ||
      !formData?.nbOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // On démarre le chargement
    setLoading(true);

    // On construit le prompt final pour l'IA
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      `${formData?.location?.name}, ${formData?.location?.adminName1}, ${formData?.location?.lat}, ${formData?.location?.lng}`
    )
      .replace("{totalDays}", formData?.nbOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.nbOfDays);
    console.log(FINAL_PROMPT);

    // On envoie le prompt à l'IA et on attend la réponse
    const result = await chatSession.sendMessage(FINAL_PROMPT);

    // On arrête le chargement
    setLoading(false);

    // On récupère la réponse de l'IA
    const jsonResponse = await result?.response?.text();
    console.log("Réponse de l'IA:", jsonResponse);

    try {
      // On parse la réponse de l'IA
      const parsedResponse = JSON.parse(jsonResponse);

      // On récupère l'itinéraire et les hôtels de la réponse
      const itinerary = parsedResponse?.itinerary || [];
      const hotels = parsedResponse?.hotelOptions || [];

      console.log("Itinéraire avant envoi:", itinerary);
      console.log("Hôtels avant envoi:", hotels);

      // On crée un objet de données pour le voyage
      const tripData = {
        budget: formData.budget,
        location: formData.location,
        nbOfDays: formData.nbOfDays,
        traveler: formData.traveler,
        itinerary: itinerary.map((day) => ({
          day: day.day,
          plan: Array.isArray(day.plan) ? day.plan : [],
        })),
        hotels: hotels.map((hotel) => ({
          hotelName: hotel.hotelName,
          hotelAddress: hotel.hotelAddress,
          price: hotel.price,
          geoCoordinates: hotel.geoCoordinates,
          rating: hotel.rating,
          description: hotel.descriptions,
        })),
      };

      // On envoie les données du voyage à l'API
      const response = await axios.post(
        "http://localhost:5001/api/trips",
        tripData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // On récupère l'ID du voyage
      const tripId = response.data.tripId;
      console.log("Voyage créé avec succès");

      // On redirige l'utilisateur vers la page de visualisation du voyage
      navigate(`/view-trip/${tripId}`);
    } catch (error) {
      console.error("Erreur lors de la création du voyage :", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen no-scroll ">
      <div className="w-full p-10">
        <div className="text-center mb-36 mt-[6rem]">
          <h1 className="text-4xl font-extrabold text-white mb-4 capitalize ">
            Parlez-nous de vos préférences de voyage
          </h1>
          <p className="text-xl text-gray-100">
            Donnez-nous quelques détails et notre planificateur de voyage créera
            un itinéraire personnalisé selon vos envies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg flex-grow flex flex-col justify-center items-center text-center w-full">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              Quelle est votre destination préférée ?
            </h2>
            <AutocompleteSearch
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          </div>

          <div className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg flex-grow flex flex-col justify-center items-center text-center w-full">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              Combien de jours souhaitez-vous voyager ?
            </h2>
            <Input
              placeholder={"Exemple: 3"}
              type="number"
              onChange={(e) => {
                const value = e.target.value < 1 ? 1 : e.target.value;
                handleInputChange("nbOfDays", value);
              }}
              className="font-light"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full">
          <div className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg flex-grow flex flex-col justify-center items-center text-center w-full">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              Quel budget souhaitez-vous allouer à ce voyage ?
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Le budget comprend uniquement les activités et les repas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg shadow-lg hover:cursor-pointer transition-transform transform hover:scale-105 w-full
                                        ${
                                          formData?.budget == item.title &&
                                          "border-dotted border-[#f65151]"
                                        }`}
                  onClick={() => handleInputChange("budget", item.title)}
                >
                  <h2 className="text-3xl">{item.icon}</h2>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg flex-grow flex flex-col justify-center items-center text-center w-full">
            <h2 className="text-2xl font-bold mb-11 capitalize">
              Avec qui voyagez-vous pour ce voyage ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg shadow-lg hover:cursor-pointer transition-transform transform hover:scale-105 w-full
                                        ${
                                          formData?.traveler == item.people &&
                                          "border-dotted border-[#f65151]"
                                        }`}
                  onClick={() => handleInputChange("traveler", item.people)}
                >
                  <h2 className="text-3xl">{item.icon}</h2>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="hover:bg-[#f56551] text-sm py-3 px-8 capitalize border-solid border-2 border-[#f56551]"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            ) : (
              "Générer mon voyage"
            )}
          </Button>
        </div>
      </div>

      <LoginDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onLoginSuccess={OnGenerateTrip}
      />
    </div>
  );
}

export default CreateTrip;
