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

export const AI_PROMPT = 'Generate a travel plan in french for location: {location}, for {totalDays} days for {traveler} with a {budget} budget. Provide a list of hotel options with "hotelName", "hotelAddress", "price", "geoCoordinates", "rating", "descriptions". Additionally, suggest a detailed daily itinerary including "day", "placeName", "placeDetails", "placeImageUrl", "geoCoordinates", "ticketPricing", "time", "timeTravel", and "from". The output should be in JSON format as follows: "hotelOptions": [{hotelName, hotelAddress, price, geoCoordinates, rating, descriptions}], and "itinerary": [{day, plan: [{placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, time, timeTravel, from}]}] for {totalDays} days.';
// Exemple de structure JSON désirée :

/*
{
  "hotelOptions": [
    {
      "hotelName": "The Ritz-Carlton, South Beach",
      "hotelAddress": "1 Lincoln Road, Miami Beach, FL 33139, États-Unis",
      "price": "à partir de 450 $ la nuit",
      "geoCoordinates": "25.7686,-80.1317",
      "rating": "4.5 étoiles",
      "descriptions": "Un hôtel de luxe avec une plage privée, une piscine à débordement et des restaurants gastronomiques."
    },
    {
      "hotelName": "The Setai, Miami Beach",
      "hotelAddress": "2001 Collins Ave, Miami Beach, FL 33139, États-Unis",
      "price": "à partir de 350 $ la nuit",
      "geoCoordinates": "25.7937,-80.1377",
      "rating": "4 étoiles",
      "descriptions": "Un hôtel élégant avec une vue imprenable sur l'océan, une plage privée et des options de restauration exceptionnelles."
    },
    {
      "hotelName": "The Fontainebleau Miami Beach",
      "hotelAddress": "4441 Collins Ave, Miami Beach, FL 33140, États-Unis",
      "price": "à partir de 250 $ la nuit",
      "geoCoordinates": "25.7969,-80.1429",
      "rating": "4 étoiles",
      "descriptions": "Un hôtel emblématique avec une plage privée, plusieurs piscines et une variété d'options de restauration et de divertissement."
    }
  ],
  "itinerary": [
    {
      "day": "Jour 1",
      "plan": [
        {
          "placeName": "South Beach",
          "placeDetails": "Promenez-vous sur la célèbre plage de South Beach, admirez les bâtiments Art Déco et profitez du soleil et de la mer.",
          "placeImageUrl": "https://www.miamibeachfl.gov/sites/default/files/styles/featured_image_lg/public/2019-07/South-Beach-Day-2-1024x576.jpg",
          "geoCoordinates": "25.7617,-80.1300",
          "ticketPricing": "Gratuit",
          "time": "10h à 14h",
          "timeTravel": "10 mn à pied de votre hôtel",
          "from": "Votre hôtel"
        },
        {
          "placeName": "Ocean Drive",
          "placeDetails": "Explorez Ocean Drive, la rue la plus animée de South Beach, avec ses restaurants, bars et boutiques.",
          "placeImageUrl": "https://www.miamibeachfl.gov/sites/default/files/styles/featured_image_lg/public/2018-03/Ocean-Drive-1024x576.jpg",
          "geoCoordinates": "25.7712,-80.1330",
          "ticketPricing": "Gratuit",
          "time": "14h à 18h",
          "timeTravel": "5 mn à pied de South Beach",
          "from": "South Beach"
        },
        {
          "placeName": "Art Deco Welcome Center",
          "placeDetails": "Découvrez l'histoire de l'architecture Art Déco de Miami Beach et participez à une visite guidée.",
          "placeImageUrl": "https://www.miamibeachfl.gov/sites/default/files/styles/featured_image_lg/public/2018-03/Art-Deco-Welcome-Center-1024x576.jpg",
          "geoCoordinates": "25.7704,-80.1323",
          "ticketPricing": "Gratuit",
          "time": "18h à 20h",
          "timeTravel": "5 mn à pied d'Ocean Drive",
          "from": "Ocean Drive"
        },
        {
          "placeName": "Joe's Stone Crab",
          "placeDetails": "Savourez un dîner de crabe de pierre dans ce restaurant emblématique de Miami Beach.",
          "placeImageUrl": "https://www.joesstonecrab.com/media/img/restaurant-exterior.jpg",
          "geoCoordinates": "25.7780,-80.1379",
          "ticketPricing": "À la carte",
          "time": "20h à 23h",
          "timeTravel": "15 mn à pied d'Art Deco Welcome Center",
          "from": "Art Deco Welcome Center"
        }
      ]
    },
    {
      "day": "Jour 2",
      "plan": [
        {
          "placeName": "Vizcaya Museum & Gardens",
          "placeDetails": "Visitez ce magnifique manoir et ses jardins, offrant un aperçu du luxe de l'époque de la Renaissance italienne.",
          "placeImageUrl": "https://www.vizcaya.org/sites/default/files/styles/hero_image_800x533/public/2021-05/Vizcaya-Garden-Fountain.jpg",
          "geoCoordinates": "25.7529,-80.1339",
          "ticketPricing": "22 $ par adulte",
          "time": "10h à 13h",
          "timeTravel": "20 mn en voiture de votre hôtel",
          "from": "Votre hôtel"
        },
        {
          "placeName": "Wynwood Walls",
          "placeDetails": "Explorez ce quartier d'art urbain coloré et admirez les graffitis de certains des meilleurs artistes de rue du monde.",
          "placeImageUrl": "https://www.wynwoodwalls.com/assets/images/default/wynwood-walls-art-gallery-mural-art.jpg",
          "geoCoordinates": "25.7840,-80.1950",
          "ticketPricing": "Gratuit",
          "time": "13h à 16h",
          "timeTravel": "30 mn en voiture de Vizcaya Museum & Gardens",
          "from": "Vizcaya Museum & Gardens"
        },
        {
          "placeName": "Little Havana",
          "placeDetails": "Plongez dans la culture cubaine vibrante de Little Havana, avec ses restaurants, ses bars et ses boutiques.",
          "placeImageUrl": "https://www.miamibeachfl.gov/sites/default/files/styles/featured_image_lg/public/2019-07/Little-Havana-1024x576.jpg",
          "geoCoordinates": "25.7653,-80.2130",
          "ticketPricing": "Gratuit",
          "time": "16h à 19h",
          "timeTravel": "15 mn en voiture de Wynwood Walls",
          "from": "Wynwood Walls"
        },
        {
          "placeName": "Calle Ocho",
          "placeDetails": "Promenez-vous sur Calle Ocho, la rue principale de Little Havana, et découvrez les boutiques, les restaurants et l'atmosphère animée.",
          "placeImageUrl": "https://www.miamibeachfl.gov/sites/default/files/styles/featured_image_lg/public/2019-07/Calle-Ocho-1024x576.jpg",
          "geoCoordinates": "25.7649,-80.2125",
          "ticketPricing": "Gratuit",
          "time": "19h à 21h",
          "timeTravel": "5 mn à pied de Little Havana",
          "from": "Little Havana"
        }
      ]
    }
  ]
}
*/