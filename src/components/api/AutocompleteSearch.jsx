// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Composant pour la recherche d'autocomplétion de ville
function AutocompleteSearch({ selectProps }) {
  // État pour stocker la requête de recherche
  const [query, setQuery] = useState('');
  // État pour stocker les suggestions des villes
  const [suggestions, setSuggestions] = useState([]);
  // État pour stocker la ville sélectionnée
  const [selectedCity, setSelectedCity] = useState(null);

  // Effet pour déclencher la recherche lorsque la requête dépasse 2 caractères
  useEffect(() => {
    if (query.length > 2 && query !== selectedCity?.name) {
      fetchCities(query);
    }
  }, [query, selectedCity?.name]);

  // Fonction pour récupérer les villes correspondant au terme de recherche
  const fetchCities = (searchTerm) => {
    fetch(`http://api.geonames.org/searchJSON?name_startsWith=${searchTerm}&maxRows=10&username=mathieu`)
      .then(response => response.json())
      .then(data => {
        // Mise à jour des suggestions avec les résultats de la recherche
        setSuggestions(data.geonames);
      })
      .catch(error => console.error('Error:', error));
  };

  // fonction pour gérer le clic sur une suggestion de ville
  const handleSuggestionClick = (city) => {
    // Mise à jour de la requête avec le nom de la ville sélectionnée
    setQuery(city.name);
    // Appel de la fonction onChange passée via les props pour notifier la sélection
    selectProps.onChange(city);
    // Mise à jour de la ville sélectionnée
    setSelectedCity(city);
    // Réinitialisation des suggestions après une courte pause
    setTimeout(() => {
      setSuggestions([]);
    }, 100);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="w-full md:w-3/4"> {/* Augmenté à 3/4 pour tablette */}
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Rechercher une ville..." 
          className="w-full font-light text-sm h-10 p-2 border border-gray-200 rounded border-solid focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="w-full md:w-1/2"> 
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
          {suggestions.map((city) => (
            <li 
              key={city.geonameId} 
              className="p-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={() => handleSuggestionClick(city)}
            >
              {city.name}, {city.countryName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

AutocompleteSearch.propTypes = {
  selectProps: PropTypes.object.isRequired,
};

export default AutocompleteSearch;
