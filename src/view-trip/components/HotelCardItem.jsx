import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { useEffect, useState } from 'react';


// Carte de l'hôtel
function HotelCardItem({ hotel }) {

  // Récupérer la photo de l'hôtel
  const [photoUrl, setPhotoUrl] = useState()

  useEffect(() => {
    const GetPlacePhoto = async () => {
      try {
        const data = {
          textQuery: hotel?.hotelName
        }

        // Récupérer les données de l'hôtel
        const response = await GetPlaceDetails(data);
        const place = response.data.places[0];

        // Récupérer l'URL de la photo
        if (place && place.photos && place.photos.length > 0) {
          const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', place.photos[0].name);
          setPhotoUrl(PhotoUrl);
        } else {
          console.error("Aucune photo disponible pour cet hôtel");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du lieu:", error);
      }
    }

    if (hotel) GetPlacePhoto();
  }, [hotel]);

  return (
    <div>
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + "," + hotel.hotelAddress} target='_blank'>
        <div className='border-solid border-2 border-gray-200 mt-5 p-4 rounded-t-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white'>
          <img src={photoUrl ? photoUrl : "/avion.png"} className='rounded-t-xl h-[300px] w-full object-cover' alt="" />
          <div className='my-2 flex flex-col gap-2'>
            <h2 className='font-medium'>{hotel?.hotelName}</h2>
            <h2 className='text-xs text-gray-500'>📍 {hotel?.hotelAddress}</h2>
            <h2 className='text-sm text-gray-500'>💰 {hotel?.price} par nuit</h2>
            <h2 className='text-sm text-gray-500'>⭐ {hotel?.rating} étoiles</h2>
          </div>
        </div>
      </Link>
    </div>
  )
}

HotelCardItem.propTypes = {
  hotel: PropTypes.shape({
    hotelName: PropTypes.string.isRequired,
    hotelAddress: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    rating: PropTypes.string,
  }),
};

export default HotelCardItem;
