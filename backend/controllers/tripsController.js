import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { createLocation } from './locationsController.js';
import { createItinerary } from './itineraryController.js';
import { createHotels } from './hotelsController.js';


// Fonction pour créer un voyage
export const createTrip = (req, res) => {
  const { budget, location, nbOfDays, traveler, itinerary, hotels } = req.body;

  console.log('Données reçues:', req.body); 

  const userId = req.user.id;
  const tripId = uuidv4();

  const tripQuery = 'INSERT INTO trips (id, userId, budget, location, nbOfDays, traveler) VALUES (?, ?, ?, ?, ?, ?)';
  const tripValues = [tripId, userId, budget, location.name, nbOfDays, traveler];

  db.query(tripQuery, tripValues, (err) => {
    if (err) {
      console.error('Erreur lors de la création du voyage :', err);
      return res.status(500).json({ error: 'Erreur lors de la création du voyage' });
    }

    createLocation(tripId, location, (err) => {
      if (err) {
        console.error('Erreur lors de la création de la localisation :', err);
        return res.status(500).json({ error: 'Erreur lors de la création de la localisation' });
      }

      createItinerary(tripId, itinerary, (err) => {
        if (err) {
          console.error('Erreur lors de la création de l\'itinéraire :', err);
          return res.status(500).json({ error: 'Erreur lors de la création de l\'itinéraire' });
        }

        createHotels(tripId, hotels, (err) => {
          if (err) {
            console.error('Erreur lors de la création des hôtels :', err);
            return res.status(500).json({ error: 'Erreur lors de la création des hôtels' });
          }

          res.status(201).json({ message: 'Voyage, localisation, itinéraire et hôtels créés avec succès', tripId: tripId });
        });
      });
    });
  });
};

// Fonction pour récupérer les voyages
export const getTrips = (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM trips WHERE userId = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des voyages :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des voyages' });
    }
    res.status(200).json(results);
  });
};

// Fonction pour récupérer un voyage par ID
export const getTripById = (req, res) => {
  const { tripId } = req.params;

  const tripQuery = `
      SELECT 
      trips.*, 
      locations.adminCode1, locations.adminName1, locations.countryCode, locations.countryName, locations.geonameId, locations.lat, locations.lng, locations.population,
      itinerary.id as itineraryId, itinerary.day, itinerary.placeName, itinerary.placeDetails, itinerary.placeImageUrl, itinerary.geoCoordinates, itinerary.ticketPricing, itinerary.timeTravel, itinerary.time,
      hotels.id as hotelId, hotels.hotelName, hotels.hotelAddress, hotels.price, hotels.geoCoordinates as hotelGeoCoordinates, hotels.rating, hotels.description
    FROM trips
    LEFT JOIN locations ON trips.id = locations.tripId
    LEFT JOIN itinerary ON trips.id = itinerary.tripId
    LEFT JOIN hotels ON trips.id = hotels.tripId
    WHERE trips.id = ?
  `;

  db.query(tripQuery, [tripId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du voyage :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du voyage' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = {
      id: results[0].id,
      userId: results[0].userId,
      budget: results[0].budget,
      nbOfDays: results[0].nbOfDays,
      traveler: results[0].traveler,
      created_at: results[0].created_at,
      location: results[0].location,
      locations: {
        adminCode1: results[0].adminCode1,
        adminName1: results[0].adminName1,
        countryCode: results[0].countryCode,
        countryName: results[0].countryName,
        geonameId: results[0].geonameId,
        lat: results[0].lat,
        lng: results[0].lng,
        population: results[0].population
      },
      itinerary: [],
      hotels: []
    };

    const itineraryMap = new Map();
    const hotelsMap = new Map();

    results.forEach(row => {
      if (row.itineraryId && !itineraryMap.has(row.itineraryId)) {
        trip.itinerary.push({
          id: row.itineraryId,
          day: row.day,
          placeName: row.placeName,
          placeDetails: row.placeDetails,
          placeImageUrl: row.placeImageUrl,
          geoCoordinates: row.geoCoordinates,
          ticketPricing: row.ticketPricing,
          timeTravel: row.timeTravel,
          time: row.time
        });
        itineraryMap.set(row.itineraryId, true);
      }
      if (row.hotelId && !hotelsMap.has(row.hotelId)) {
        trip.hotels.push({
          id: row.hotelId,
          hotelName: row.hotelName,
          hotelAddress: row.hotelAddress,
          price: row.price,
          geoCoordinates: row.hotelGeoCoordinates,
          rating: row.rating,
          description: row.description
        });
        hotelsMap.set(row.hotelId, true);
      }
    });

    res.status(200).json(trip);
  });
};