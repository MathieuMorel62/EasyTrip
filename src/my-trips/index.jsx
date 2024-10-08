/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserTripCardItem from './components/UserTripCardItem';


// Fonction pour afficher les trips de l'utilisateur
function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

  // Récupération des trips de l'utilisateur
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await axios.get('http://localhost:5001/api/trips', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const tripDetailsPromises = response.data.map(trip =>
          axios.get(`http://localhost:5001/api/trips/${trip.id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }).then(res => res.data)
        );

        const tripDetails = await Promise.all(tripDetailsPromises);
        setTrips(tripDetails);
      } catch (error) {
        console.error('Erreur lors de la récupération des voyages :', error);
      }
    };
    fetchTrips();
  }, []);

  // Fonction pour supprimer un trip
  const handleDeleteTrip = async (tripId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('Utilisateur non authentifié');
      }

      // Suppression du trip
      await axios.delete(`http://localhost:5001/api/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Suppression du trip de l'état
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Erreur lors de la suppression du voyage :', error);
    }
  };

  // Calcul des index pour la pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);

  return (
    <div className="relative isolate w-full min-h-screen flex flex-col justify-between bg-white overflow-hidden">
      {/* Quadrillage en arrière-plan */}
      <svg className="absolute dark:opacity-20 inset-x-0 top-0 -z-10 h-full w-full stroke-black/10 opacity-30" aria-hidden="true">
        <defs>
          <pattern id="background-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M.5 200V.5H200" fill="none"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#background-pattern)"></rect>
      </svg>

      {/* Lueur à gauche */}
      <div className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48 opacity-30" aria-hidden="true">
        <div className="aspect-[801/1036] w-[30rem] sm:w-[50rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)' }}></div>
      </div>

      {/* Lueur à droite */}
      <div className="absolute right-1/2 left-0 top-0 -z-10 -mr-24 transform-gpu overflow-hidden blur-3xl lg:mr-24 xl:mr-48 opacity-30" aria-hidden="true">
        <div className="aspect-[801/1036] w-[30rem] sm:w-[50rem] bg-gradient-to-tl from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(36.9% 70.5%, 0% 82.9%, 23.4% 97%, 51.6% 100%, 55.4% 95.3%, 45.5% 74.7%, 40.2% 51%, 44.8% 42.2%, 55.6% 42.8%, 72.2% 52.1%, 64.9% 18.5%, 100% 2.3%, 60.8% 0%, 64.8% 18.6%, 2.8% 47.2%, 36.9% 70.5%)' }}></div>
      </div>

      {/* Contenu principal */}
      <div className='pt-32 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5'>
        {/* Titre et sous-titre */}
        <h2 className='font-bold text-3xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text'>
          Mes Trips
        </h2>
        <p className='text-lg text-gray-600 mt-2'>
          Retrouvez ici vos voyages passés et futurs, organisés avec notre IA.
        </p>

        {/* Affichage des trips */}
        <div className='flex-grow flex flex-col justify-center'>
          {trips.length < 1 ? (
            <div className='flex-grow flex items-center justify-center'>
              <p className='text-2xl text-red-500 text-center mt-96'>Pas de trip généré</p> 
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-10'>
              {currentTrips.map((trip) => (
                <UserTripCardItem 
                  key={trip.id} 
                  trip={trip}
                  onDelete={handleDeleteTrip}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className='flex justify-center mt-8 mb-6'>
        {Array.from({ length: Math.ceil(trips.length / tripsPerPage) }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => setCurrentPage(index + 1)} 
            className={`px-3 py-1 text-md font-medium rounded-lg transition-colors ${currentPage === index + 1 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-gray-700 hover:text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyTrips;
