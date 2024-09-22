import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// Set global fetch to use jest-fetch-mock
global.fetch = fetchMock;
