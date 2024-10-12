/* eslint-disable no-undef */
import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// Set global fetch to use jest-fetch-mock
global.fetch = fetchMock;

// Supprime tous les logs de console pendant les tests
console.error = jest.fn();
console.log = jest.fn();
console.warn = jest.fn();
