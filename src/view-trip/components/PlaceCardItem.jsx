/* eslint-disable no-unused-vars */
import React from 'react';
import { Button } from '../../components/ui/button';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function PlaceCardItem({ place, trip }) {

  const [photoUrl, setPhotoUrl] = useState()

  useEffect(() => {
    const GetPlacePhoto = async () => {
      const data = {
        textQuery: place.placeName,
      }

      const result = await GetPlaceDetails(data).then((response) => {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[0].name);
        setPhotoUrl(PhotoUrl);
      });
    };

    if (place) GetPlacePhoto();
  }, [place]);

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + ',' + trip?.location} target='_blank'>
      <div className='min-h-48 border-solid border-gray-300 border-2 rounded-xl p-3 mt-2 mx-[0.45rem] flex gap-5 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer bg-white'>
        <img src={photoUrl?photoUrl:"/avion.png"} className='min-w-[130px] max-w-[130px] min-h-[130px] max-h-[130px] rounded-xl' alt="avion" />
        <div className='flex flex-col justify-between flex-grow'>
          <div>
            <h2 className='font-bold text-lg'>{place.placeName}</h2>
            <p className='text-sm text-gray-500'>{place.placeDetails}</p>
            <h2 className='text-sm mt-2'>🕙 {place.timeTravel}</h2>
          </div>
          <Button className='mt-2 self-end w-28'>
            <FaMapLocationDot className='w-5 h-5' />
          </Button>
        </div>
      </div>
    </Link>
  )
}

PlaceCardItem.propTypes = {
  place: PropTypes.shape({
    placeName: PropTypes.string.isRequired,
    placeDetails: PropTypes.string,
    timeTravel: PropTypes.string.isRequired,
  }).isRequired,
  trip: PropTypes.shape({
    location: PropTypes.string.isRequired,
  }).isRequired,
};

export default PlaceCardItem;