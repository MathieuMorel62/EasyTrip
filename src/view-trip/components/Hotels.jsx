/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import HotelCardItem from './HotelCardItem';


function Hotels({ trip }) {
  return (
    <div>
      <h2 className='text-2xl font-bold mt-5'>Hôtels recommandés</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4'>
        {trip.hotels && trip.hotels.length > 0 ? (
          trip.hotels.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel} />
          ))
        ) : (
          <p>Aucun hôtel disponible pour ce voyage.</p>
        )}
      </div>
    </div>
  );
}

Hotels.propTypes = {
  trip: PropTypes.shape({
    hotels: PropTypes.arrayOf(
      PropTypes.shape({
        hotelName: PropTypes.string.isRequired,
        hotelAddress: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        rating: PropTypes.string,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default Hotels;