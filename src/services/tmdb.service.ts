import axios from 'axios';
import { env } from '../config/index.js';  // Assuming you're loading env vars here
import { TMDBMovie, TMDBCredits } from '../types/index.js';

export class TMDBService {
    private readonly apiKey: string;
  
    constructor() {
      this.apiKey = env.TMDB_API_KEY;
    }
  
    async getMoviesByYear(year: string): Promise<TMDBMovie[]> {
      try {
        const response = await axios.get<{ results: TMDBMovie[] }>(
          'https://api.themoviedb.org/3/discover/movie',
          {
            params: {
              api_key: this.apiKey,
              language: 'en-US',
              page: 1,
              primary_release_year: year,
              sort_by: 'popularity.desc'
            }
          }
        );
        return response.data.results;
      } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
      }
    }
  
    async getMovieCredits(movieId: number): Promise<string[]> {
      try {
        const response = await axios.get<TMDBCredits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            params: {
              api_key: this.apiKey
            }
          }
        );
        
        return response.data.crew
          .filter(member => member.known_for_department === 'Editing')
          .map(editor => editor.name);
      } catch (error) {
        console.error(`Error fetching credits for movie ${movieId}:`, error);
        return [];
      }
    }
  }