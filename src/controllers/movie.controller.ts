import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdb.service.js';

export class MovieController {
  private tmdbService: TMDBService;

  constructor() {
    this.tmdbService = new TMDBService();
  }

  // Fetch movies for a specific year
  async getMoviesByYear(req: Request, res: Response): Promise<void> {
    const year = req.params.year;

    // Validate the year format (must be YYYY)
    if (!year || !/^\d{4}$/.test(year)) {
      res.status(400).json({ error: 'Invalid year format. Use YYYY format.' });
      return;
    }

    try {
      const movies = await this.tmdbService.getMoviesByYear(year);

      // Check if movies were found
      if (!movies || movies.length === 0) {
        res.status(404).json({ error: 'No movies found for the specified year.' });
        return;
      }

      const moviePromises = movies.map(async (movie) => {
        // Get editors for each movie
        const editors = await this.tmdbService.getMovieCredits(movie.id);

        // Format the release date
        const formattedDate = new Date(movie.release_date);
        const releaseDate = formattedDate instanceof Date && !isNaN(formattedDate.getTime())
          ? formattedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'Unknown Release Date';

        // Return the formatted response for the movie
        return {
          title: movie.title,
          release_date: releaseDate,
          vote_average: movie.vote_average,
          editors: editors || []
        };
      });

      // Resolve all movie promises
      const results = await Promise.all(moviePromises);
      res.json(results);
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
