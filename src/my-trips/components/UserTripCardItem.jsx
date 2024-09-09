import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { FaRegTrashCan } from 'react-icons/fa6';


// Fonction pour afficher les voyages de l'utilisateur et permettre de les supprimer
function UserTripCardItem({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState();
  // État pour gérer l'ouverture et la fermeture du menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Fonction pour ouvrir le menu
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour supprimer un voyage
  const handleDelete = () => {
    onDelete(trip.id);
    handleMenuClose();
  };

  // Fonction pour récupérer la photo de la destination
  const GetPlacePhoto = useCallback(async () => {
    const data = {
      textQuery: trip.location + trip.locations.adminName1 + trip.locations.countryName,
    };
    await GetPlaceDetails(data).then((response) => {
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);
    });
  }, [trip]);

  // Effet pour récupérer la photo de la destination lorsque le voyage est disponible
  useEffect(() => {
    if (trip) GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

  return (
    <div className='border-solid border-2 border-gray-300 rounded-t-xl p-5 mb-5 hover:scale-105 transition-all hover:shadow-md relative'>
      <Link to={`/view-trip/${trip.id}`}>
        <img src={photoUrl ? photoUrl : './avion.png'} className='object-cover rounded-t-xl w-full h-[350px]' />
        <div>
          <h2 className='font-bold text-lg mt-2'>{trip?.location} - {trip?.locations?.countryName ? trip.locations.countryName : 'Pays non disponible'}</h2>
          <h2 className='text-sm text-gray-500'>{trip?.nbOfDays} jours de voyage avec un budget {trip?.budget}</h2>
        </div>
      </Link>
      <div className='absolute bottom-2 right-2'>
        <button 
          onClick={handleMenuOpen} 
          className='text-lg p-2 hover:bg-gray-200 rounded-full'
        >
          <FaRegTrashCan />
        </button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleDelete}>Supprimer</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

UserTripCardItem.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    nbOfDays: PropTypes.number.isRequired,
    budget: PropTypes.number.isRequired,
    locations: PropTypes.shape({
      countryName: PropTypes.string,
      adminName1: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserTripCardItem;