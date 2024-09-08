export const SelectTravelesList = [
  {
    id: 1,
    title: 'Seul(e)',
    desc: 'Voyage en solo pour explorer',
    icon: '✈️',
    people: '1 personne'
  },
  {
    id: 2,
    title: 'En Couple',
    desc: 'Partagez une aventure à deux',
    icon: '🥂',
    people: '2 Personnes'
  },
  {
    id: 3,
    title: 'En Famille',
    desc: 'Un groupe familial plein d\'aventure',
    icon: '🏡',
    people: '3 à 5 Personnes'
  },
  {
    id: 4,
    title: 'Entre Ami(e)s',
    desc: 'Un groupe d’ami(e)s en quête de sensations',
    icon: '🏕️',
    people: '5 à 10 Personnes'
  }
];


export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Économique',
    desc: 'Restez attentif aux coûts',
    icon: '💵'
  },
  {
    id: 2,
    title: 'Modéré',
    desc: 'Gardez un budget moyen',
    icon: '💰'
  },
  {
    id: 3,
    title: 'Luxe',
    desc: 'Ne vous souciez pas du coût',
    icon: '💸'
  }
];

export const AI_PROMPT = `Generate a detailed travel plan in French for the location: {location}, lasting {totalDays} days, for {traveler}, with a budget of {budget}. The output should be in French and include two sections:
1. "hotelOptions" — Provide at least three hotel options in French, with each hotel described using the following attributes: "hotelName", "hotelAddress", "price" (specify the currency), "geoCoordinates" (latitude and longitude), "rating" (in stars), and "descriptions" (highlighting the hotel's key features, like amenities, location, and style).
2. "itinerary" — Suggest a day-by-day detailed itinerary for {totalDays} days in French, with each day formatted as "Jour {dayNumber}". For each day, provide a list of activities organized in a logical sequence to minimize travel time, including a **lunch break**, **dinner**, and potentially a night out based on the traveler profile. Each activity should include:
  - "day" (e.g., Jour 1, Jour 2, etc.),
  - "plan" (A list of activities for that day). For each activity, include:
    - "placeName" (name of the place),
    - "placeDetails" (brief description of the activity or site in French),
    - "geoCoordinates" (latitude and longitude),
    - "ticketPricing" (indicate the cost or mention if free in French),
    - "time" (start and end time for the visit in the format "from {startTime} to {endTime}", e.g., "de 10h à 12h"),
    - "timeTravel" (travel time from the previous location in minutes or hours in French, e.g., "15 minutes à pied", "20 minutes en voiture"),
    - "from" (starting point of travel, which should be the previous activity or the hotel for the first activity of the day).

Ensure the following is included within the "itinerary" plan:
- A **lunch break** at a local restaurant or café, fitting the {budget}. Provide the restaurant name, address, and a brief description.
- A **dinner reservation** at a suitable restaurant according to the {budget}, with details like name, address, and the type of cuisine.
- If the traveler profile fits, suggest a **night out at a club** or bar. This should be determined by {traveler} (e.g., if they are traveling with friends or solo). Include the venue's name, address, and entry pricing.

Please ensure that the final output is in French and structured in JSON format as follows:
{
  "hotelOptions": [
    {
      "hotelName": "Example Hotel",
      "hotelAddress": "Adresse, Ville, Pays",
      "price": "À partir de {prix} par nuit",
      "geoCoordinates": "{latitude},{longitude}",
      "rating": "{nombre d'étoiles} étoiles",
      "descriptions": "{caractéristiques principales}"
    },
    ...
  ],
  "itinerary": [
    {
      "day": "Jour {dayNumber}",
      "plan": [
        {
          "placeName": "{nom_du_lieu}",
          "placeDetails": "{description_du_lieu}",
          "geoCoordinates": "{latitude},{longitude}",
          "ticketPricing": "{prix_ou_gratuit}",
          "time": "de {heure_de_début} à {heure_de_fin}",  // e.g., "de 10h à 12h"
          "timeTravel": "{temps_de_trajet} depuis {lieu_précédent}",  // e.g., "15 minutes à pied depuis votre hôtel"
          "from": "{point_de_départ}"  // e.g., "votre hôtel"
        },
        // Lunch break
        {
          "placeName": "{nom_du_restaurant}",
          "placeDetails": "Pause déjeuner dans un restaurant local selon votre budget.",
          "geoCoordinates": "{latitude},{longitude}",
          "ticketPricing": "{prix_ou_gratuit}",
          "time": "de {heure_de_début} à {heure_de_fin}",  // e.g., "de 12h30 à 14h"
          "timeTravel": "{temps_de_trajet} depuis {lieu_précédent}",
          "from": "{point_de_départ}"
        },
        // Afternoon activities...
        // Dinner reservation
        {
          "placeName": "{nom_du_restaurant}",
          "placeDetails": "Dîner dans un restaurant recommandé selon votre budget.",
          "geoCoordinates": "{latitude},{longitude}",
          "ticketPricing": "{prix_ou_gratuit}",
          "time": "de {heure_de_début} à {heure_de_fin}",  // e.g., "de 19h à 21h"
          "timeTravel": "{temps_de_trajet} depuis {lieu_précédent}",
          "from": "{point_de_départ}"
        },
        // Optional: Night out
        {
          "placeName": "{nom_du_club}",
          "placeDetails": "Sortie en boîte de nuit ou bar selon le profil du voyageur.",
          "geoCoordinates": "{latitude},{longitude}",
          "ticketPricing": "{prix_ou_gratuit}",
          "time": "de {heure_de_début} à {heure_de_fin}",  // e.g., "de 23h à 2h"
          "timeTravel": "{temps_de_trajet} depuis {lieu_précédent}",
          "from": "{point_de_départ}"
        }
      ]
    },
    ...
  ]
}`;
