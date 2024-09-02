import db from '../config/db.js';


// Fonction pour créer un itinéraire
export const createItinerary = (tripId, itinerary, callback) => {

  // Vérifiez si l'itinéraire est défini et est un tableau
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    // Pas d'itinéraire à créer, continuer sans erreur
    return callback(null);
  }

  // Création des requêtes SQL pour chaque jour de l'itinéraire
  const itineraryQueries = itinerary.map((day) => {
    // Extraction des plans de chaque jour
    const { plan } = day;
    // Création des requêtes SQL pour chaque plan de jour
    const planQueries = plan.map((place) => {
      // Extraction des informations de chaque lieu
      const { placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, timeTravel, time } = place;
      // Création de la requête SQL pour insérer le lieu dans la base de données
      const query = 'INSERT INTO itinerary (id, tripId, day, placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, timeTravel, time) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      // Création des valeurs pour la requête SQL
      const values = [tripId, day.day, placeName, placeDetails, placeImageUrl, JSON.stringify(geoCoordinates), ticketPricing, timeTravel, time];

      console.log('SQL Query:', query);
      console.log('Values:', values);

      return { query, values };
    });
    return planQueries;
  }).flat();

  // Fonction pour exécuter les requêtes SQL
  const executeQueries = (queries, index, callback) => {
    // Vérifiez si toutes les requêtes ont été exécutées
    if (index === queries.length) {
      callback(null);
      return;
    }

    // Extraction de la requête et des valeurs pour l'index actuel
    const { query, values } = queries[index];
    // Exécution de la requête SQL
    db.query(query, values, (err) => {
      if (err) {
        callback(err);
      } else {
        executeQueries(queries, index + 1, callback);
      }
    });
  };

  // Exécution des requêtes SQL
  executeQueries(itineraryQueries, 0, callback);
};
