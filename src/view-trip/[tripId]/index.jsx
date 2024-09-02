import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await axios.get(`http://localhost:5001/api/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTrip(response.data);
        console.log('Données du voyage:', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du voyage :', error);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (!trip) {
    return <div className='flex items-center justify-center h-screen'><img src="/spinner.gif" alt="loading" /></div>;
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <InfoSection trip={trip} />
      {/* Recommended Hotels */}
      <Hotels trip={trip} />
      {/* Daily Plan */}
      <PlacesToVisit trip={trip}/>
      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default ViewTrip;