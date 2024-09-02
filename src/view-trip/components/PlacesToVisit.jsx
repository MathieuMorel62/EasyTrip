import PropTypes from 'prop-types';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  // Grouper les lieux par jour
  const groupedItinerary = trip.itinerary.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h2 className='text-2xl font-bold my-5'>Lieux à visiter</h2>
      {Object.keys(groupedItinerary).length > 0 ? (
        Object.keys(groupedItinerary).map((day, index) => (
          <div key={index} className="mt-5">
            <h2 className='text-medium font-bold'>{day}</h2>
            <div className='grid md:grid-cols-2 gap-4 mb-10'>
              {groupedItinerary[day].map((place, idx) => (
                <div key={idx} className='my-2'>
                  <h2 className='text-sm mx-1 font-medium text-orange-600'>{place.time}</h2>
                  <PlaceCardItem place={place} trip={trip} />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className='text-xs text-gray-500'>Aucun itinéraire disponible pour ce voyage.</p>
      )}
    </div>
  );
}

PlacesToVisit.propTypes = {
  trip: PropTypes.shape({
    itinerary: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.string.isRequired,
        placeName: PropTypes.string.isRequired,
        placeDetails: PropTypes.string,
        timeTravel: PropTypes.string,
        time: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default PlacesToVisit;