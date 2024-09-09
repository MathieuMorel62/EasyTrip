import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { Link } from 'react-router-dom';


// Carte des trips de l'utilisateur
function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  // Récupérer la photo du trip
  const GetPlacePhoto = useCallback(async () => {
    const data = {
      textQuery: trip.location + trip.locations.adminName1 + trip.locations.countryName,
    };
    // Récupérer les données de la location
    await GetPlaceDetails(data).then((response) => {
      // Récupérer l'URL de la photo
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);
    });
  }, [trip]);

  useEffect(() => {
    if (trip) GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className='border-solid border-2 border-gray-300 rounded-t-xl p-5 mb-5 hover:scale-105 transition-all hover:shadow-md'>
        <img src={photoUrl ? photoUrl : './avion.png'} className='object-cover rounded-t-xl w-full h-[350px]' />
        <div>
          <h2 className='font-bold text-lg mt-2'>{trip?.location} - {trip?.locations?.countryName ? trip.locations.countryName : 'Pays non disponible'}</h2>
          <h2 className='text-sm text-gray-500'>{trip?.nbOfDays} jours de voyage avec un budget {trip?.budget}</h2>
        </div>
      </div>
    </Link>
  );
}

UserTripCardItem.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    nbOfDays: PropTypes.number.isRequired,
    budget: PropTypes.number.isRequired,
    locations: PropTypes.shape({
      countryName: PropTypes.string,
      adminName1: PropTypes.string,
    }),
  }).isRequired,
};

export default UserTripCardItem;