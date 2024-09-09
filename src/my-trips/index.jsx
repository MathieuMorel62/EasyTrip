import { useEffect, useState } from 'react';
import axios from 'axios';
import UserTripCardItem from './components/UserTripCardItem';


// Fonction pour afficher les trips de l'utilisateur
function MyTrips() {
  const [trips, setTrips] = useState([]);
  // Fonction pour gérer la pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Nombre de trips par page
  const tripsPerPage = 6;

  // Récupére les trips de l'utilisateur
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Récupérer l'utilisateur
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          throw new Error('Utilisateur non authentifié');
        }

        // Récupérer les trips de l'utilisateur
        const response = await axios.get('http://localhost:5001/api/trips', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Récupérer les détails des trips
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

  // Récupérer les trips de la page actuelle
  const indexOfLastTrip = currentPage * tripsPerPage;
  // Récupérer les trips de la page précédente
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  // Récupérer les trips de la page actuelle
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);

  return (
    <div className='pt-36 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5'>
      <h2 className='font-bold text-3xl'>Mes Trips</h2>
      {trips.length < 1 ? (
        <div className='flex-grow flex items-center justify-center'>
          <p className='text-2xl text-red-500 text-center mt-96'>Pas de trip généré</p> 
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 mt-10 gap-5'>
          {currentTrips.map((trip) => (
            <UserTripCardItem key={trip.id} trip={trip} />
          ))}
        </div>
      )}
      <div className='flex justify-center mt-5 absolute bottom-5 left-0 right-0'>
        {Array.from({ length: Math.ceil(trips.length / tripsPerPage) }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => setCurrentPage(index + 1)} 
            className='mx-1 text-xl cursor-pointer hover:text-blue-500'
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyTrips;
