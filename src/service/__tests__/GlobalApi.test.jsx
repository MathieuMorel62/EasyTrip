import axios from 'axios';
import { GetPlaceDetails, PHOTO_REF_URL } from '../GlobalApi';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('axios');

describe('GlobalApi', () => {
  describe('GetPlaceDetails', () => {
    it('Effectue une requête POST avec les bonnes données et config', async () => {
      const data = { query: 'Paris' };
      const responseData = { results: [] };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await GetPlaceDetails(data);

      expect(axios.post).toHaveBeenCalledWith(
        'https://places.googleapis.com/v1/places:searchText',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
            'X-Goog-FieldMask': [
              'places.photos',
              'places.displayName',
              'places.id',
            ],
          },
        }
      );
      expect(result.data).toEqual(responseData);
    });

    it('Gére les erreurs lors de la requête', async () => {
      const data = { query: 'Paris' };
      const errorMessage = 'Erreur de requête';
      axios.post.mockRejectedValue(new Error(errorMessage));

      await expect(GetPlaceDetails(data)).rejects.toThrow(errorMessage);
    });
  });

  describe('PHOTO_REF_URL', () => {
    it('Contient la clé API dans l\'URL', () => {
      expect(PHOTO_REF_URL).toContain('key=');
      expect(PHOTO_REF_URL).toMatch(/key=[^&]+/);
    });
  });
});
