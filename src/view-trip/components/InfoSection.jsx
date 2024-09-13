import { Button } from '../../components/ui/button';
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react'; // Ajout de useCallback
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

const InfoSection = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState();

  const GetPlacePhoto = useCallback(async () => {
    const data = {
      textQuery: trip.location + trip.locations.adminName1 + trip.locations.countryName,
    };

    await GetPlaceDetails(data).then((response) => {
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);
    });
  }, [trip]);

  useEffect(() => {
    if (trip) GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

  return (
    <div className='mt-20 flex flex-col gap-5'>
      <div className='relative'>
        <img src={photoUrl?photoUrl:"/avion.png"} className='h-[250px] w-full object-cover rounded-xl blur-sm' alt='avion' />
        <h2 className='absolute inset-0 flex items-center justify-center text-white font-bold text-7xl text-shadow'>{trip.location}</h2>
      </div>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-2xl'>{trip.location}, {trip.locations.adminName1} - {trip.locations.countryName}</h2>
          <div className='flex flex-col sm:flex-row gap-3 lg:gap-5 my-4'>
            <h2 className='border-solid border-2 border-gray-600 p-1 px-3 bg-white rounded-full text-gray-500 text-xs sm:text-sm md:text-base lg:text-base'>📅 {trip?.nbOfDays} {trip?.nbOfDays > 1 ? 'jours' : 'jour'}</h2>
            <h2 className='border-solid border-2 border-gray-600 p-1 px-3 bg-white rounded-full text-gray-500 text-xs sm:text-sm md:text-base lg:text-base'>💰 Budget: {trip?.budget}</h2>
            <h2 className='border-solid border-2 border-gray-600 p-1 px-3 bg-white rounded-full text-gray-500 text-xs sm:text-sm md:text-base lg:text-base'>🥂 Nombre de voyageurs: {trip?.traveler}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

InfoSection.propTypes = {
  trip: PropTypes.shape({
    locations: PropTypes.shape({
      adminName1: PropTypes.string.isRequired,
      countryName: PropTypes.string,
    }).isRequired,
    budget: PropTypes.string,
    nbOfDays: PropTypes.number,
    traveler: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
};

export default InfoSection;