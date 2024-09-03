import db from '../config/db.js';


// Fonction pour créer une localisation
export const createLocation = (tripId, location, callback) => {
  // Requête SQL pour insérer la localisation dans la base de données
  const locationQuery = 'INSERT INTO locations (id, tripId, adminCode1, adminName1, countryCode, countryName, geonameId, lat, lng, population) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const locationValues = [
    tripId,
    location.adminCode1,
    location.adminName1,
    location.countryCode,
    location.countryName,
    location.geonameId,
    location.lat,
    location.lng,
    location.population,
  ];

  // Exécution de la requête SQL pour insérer la localisation
  db.query(locationQuery, locationValues, callback);
};
