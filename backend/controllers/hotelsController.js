import db from '../config/db.js';


// Fonction pour créer des hôtels
export const createHotels = (tripId, hotels, callback) => {
  if (!Array.isArray(hotels) || hotels.length === 0) {
    return callback(null);  // Pas d'hôtels à créer, continuer sans erreur
  }

  const hotelQueries = hotels.map((hotel) => {
    let { hotelName, hotelAddress, price, geoCoordinates, rating, description } = hotel;

    // Convertir la note en nombre décimal
    rating = parseFloat(rating);

    const query = 'INSERT INTO hotels (id, tripId, hotelName, hotelAddress, price, geoCoordinates, rating, description) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)';
    const values = [tripId, hotelName, hotelAddress, price, JSON.stringify(geoCoordinates), rating, description];

    return { query, values };
  });

  const executeQueries = (queries, index, callback) => {
    if (index === queries.length) {
      callback(null);
      return;
    }

    const { query, values } = queries[index];
    db.query(query, values, (err) => {
      if (err) {
        callback(err);
      } else {
        executeQueries(queries, index + 1, callback);
      }
    });
  };

  executeQueries(hotelQueries, 0, callback);
};
