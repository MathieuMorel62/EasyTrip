import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // fonction pour générer un voyage
  const OnGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // si l'utilisateur n'est pas connecté, ouvrir la boîte de dialogue de connexion
    if (!user) {
      setOpenDialog(true);
      return;
    }

    // vérifier si tous les champs du formulaire sont remplis
    if (
      !formData?.location ||
      !formData?.nbOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    // construire le prompt final pour l'IA remplacer les variables par les valeurs du formulaire
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      `${formData?.location?.name}, ${formData?.location?.adminName1}, ${formData?.location?.lat}, ${formData?.location?.lng}`
    )
      .replace("{totalDays}", formData?.nbOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.nbOfDays);
    console.log(FINAL_PROMPT);

    // envoyer le prompt à l'IA et attendre la réponse
    const result = await chatSession.sendMessage(FINAL_PROMPT);

    setLoading(false);

    // récupérer la réponse de l'IA et la convertir en JSON
    const jsonResponse = await result?.response?.text();
    console.log("Réponse de l'IA:", jsonResponse);


    try {
      // convertir la réponse en JSON
      const parsedResponse = JSON.parse(jsonResponse);
      const itinerary = parsedResponse?.itinerary || [];
      const hotels = parsedResponse?.hotelOptions || [];

      console.log("Itinéraire avant envoi:", itinerary);
      console.log("Hôtels avant envoi:", hotels);

      // créer un objet de données de voyage avec les informations du formulaire et les données de l'itinéraire et des hôtels
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

      // envoyer les données du voyage à l'API backend
      const response = await axios.post(
        "http://localhost:5001/api/trips",
        tripData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // récupérer l'ID du voyage créé
      const tripId = response.data.tripId;
      console.log("Voyage créé avec succès");

      // rediriger l'utilisateur vers la page de visualisation du voyage
      navigate(`/view-trip/${tripId}`);
    } catch (error) {
      console.error("Erreur lors de la création du voyage :", error);
    }
  };

  return (
    <div className="isolate w-full min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Quadrillage en arrière-plan avec opacité */}
      <svg
        className="absolute dark:opacity-20 inset-x-0 top-0 -z-10 h-full w-full stroke-black/10 opacity-30"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="background-pattern"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#background-pattern)"></rect>
      </svg>

      {/* Lueur à gauche (existant) */}
      <div
        className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48 opacity-30 lg:opacity-40"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[30rem] sm:w-[50rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
          style={{
            clipPath:
              "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
          }}
        ></div>
      </div>

      {/* Nouvelle lueur à droite */}
      <div
        className="absolute right-1/2 left-0 top-0 -z-10 -mr-24 transform-gpu overflow-hidden blur-3xl lg:mr-24 xl:mr-48 opacity-30 lg:opacity-40"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[30rem] sm:w-[50rem] bg-gradient-to-tl from-[#ff80b5] to-[#9089fc]"
          style={{
            clipPath:
              "polygon(36.9% 70.5%, 0% 82.9%, 23.4% 97%, 51.6% 100%, 55.4% 95.3%, 45.5% 74.7%, 40.2% 51%, 44.8% 42.2%, 55.6% 42.8%, 72.2% 52.1%, 64.9% 18.5%, 100% 2.3%, 60.8% 0%, 64.8% 18.6%, 2.8% 47.2%, 36.9% 70.5%)",
          }}
        ></div>
      </div>

      {/* Contenu principal */}
      <div className="w-full p-4 sm:p-10">
        <div className="text-center mb-10 sm:mb-36 mt-[6rem] md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Parlez-nous de vos préférences de voyage
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-white/80 mt-4 sm:mt-6">
            Donnez-nous quelques détails et notre planificateur de voyage créera
            un itinéraire personnalisé selon vos envies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full mt-4 sm:mt-6">
          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-2xl transition-shadow hover:scale-105 transform-gpu duration-500 border-solid border-1 border-gray-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
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
          </motion.div>

          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-2xl transition-shadow hover:scale-105 transform-gpu duration-500 border-solid border-1 border-gray-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
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
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-10 w-full">
          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-2xl transition-shadow hover:scale-105 transform-gpu duration-500 border-solid border-1 border-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.2 },
            }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
              Quel budget souhaitez-vous allouer à ce voyage ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform transform-gpu duration-500 ${
                    formData?.budget === item.title &&
                    "border-solid border-purple-600"
                  }`}
                  onClick={() => handleInputChange("budget", item.title)}
                >
                  <h2 className="text-lg sm:text-2xl md:text-3xl">
                    {item.icon}
                  </h2>
                  <h2 className="text-md sm:text-lg font-bold">{item.title}</h2>
                  <p className="text-sm sm:text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-xl shadow-lg hover:shadow-2xl transition-shadow hover:scale-105 transform-gpu duration-500 border-solid border-1 border-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.3 },
            }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
              Avec qui voyagez-vous pour ce voyage ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform transform-gpu duration-500 ${
                    formData?.traveler === item.people &&
                    "border-solid border-purple-600"
                  }`}
                  onClick={() => handleInputChange("traveler", item.people)}
                >
                  <h2 className="text-lg sm:text-2xl md:text-3xl">
                    {item.icon}
                  </h2>
                  <h2 className="text-md sm:text-lg font-bold">{item.title}</h2>
                  <p className="text-sm sm:text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16 sm:mt-24 text-center">
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 text-sm sm:text-md py-2 sm:py-3 px-4 sm:px-8 capitalize text-white"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="h-5 sm:h-7 w-5 sm:w-7 animate-spin" />
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
