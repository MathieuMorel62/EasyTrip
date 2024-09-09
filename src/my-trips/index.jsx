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
    <div className='pt-36 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5'>
      <h2 className='font-bold text-3xl'>Mes Trips</h2>
      {trips.length < 1 ? (
        <div className='flex-grow flex items-center justify-center'>
          <p className='text-2xl text-red-500 text-center mt-96'>Pas de trip généré</p> 
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 mt-10 gap-5'>
          {currentTrips.map((trip) => (
            <UserTripCardItem key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
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