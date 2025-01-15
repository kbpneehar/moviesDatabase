import { Request, Response } from 'express';
import { MovieController } from '../src/controllers/movie.controller';
import { TMDBService } from '../src/services/tmdb.service';
import { describe } from 'node:test';

// Mock the TMDBService
jest.mock('../src/services/tmdb.service');

describe('MovieController', () => {
  let movieController: MovieController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock functions
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    // Setup mock request and response
    mockRequest = {
      params: { year: '2019' }
    };
    
    mockResponse = {
      json: mockJson,
      status: mockStatus
    } as Partial<Response>;

    // Initialize controller
    movieController = new MovieController();
  });

  describe('getMoviesByYear', () => {
    it('should return formatted movie data when valid year is provided', async () => {
      // Mock data
      const mockMovies = [{
        id: 1,
        title: 'Test Movie',
        release_date: '2019-01-01',
        vote_average: 8.5
      }];
      const mockEditors = ['Editor 1', 'Editor 2'];

      // Setup mocks
      (TMDBService.prototype.getMoviesByYear as jest.Mock).mockResolvedValue(mockMovies);
      (TMDBService.prototype.getMovieCredits as jest.Mock).mockResolvedValue(mockEditors);

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockJson).toHaveBeenCalledWith([{
        title: 'Test Movie',
        release_date: 'January 1, 2019',
        vote_average: 8.5,
        editors: mockEditors
      }]);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle invalid year format', async () => {
      // Setup
      //mockRequest.params.year = '20199';

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid year format. Use YYYY format.'
      });
    });

    it('should handle missing year parameter', async () => {
      // Setup
      mockRequest.params = {};

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid year format. Use YYYY format.'
      });
    });

    it('should handle empty movie results', async () => {
      // Setup
      (TMDBService.prototype.getMoviesByYear as jest.Mock).mockResolvedValue([]);

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'No movies found for the specified year.'
      });
    });

    it('should handle null movie results', async () => {
      // Setup
      (TMDBService.prototype.getMoviesByYear as jest.Mock).mockResolvedValue(null);

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'No movies found for the specified year.'
      });
    });

    it('should handle service errors', async () => {
      // Setup
      const mockError = new Error('API Error');
      (TMDBService.prototype.getMoviesByYear as jest.Mock).mockRejectedValue(mockError);

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });

    it('should handle invalid release date', async () => {
      // Mock data with invalid date
      const mockMovies = [{
        id: 1,
        title: 'Test Movie',
        release_date: 'invalid-date',
        vote_average: 8.5
      }];
      const mockEditors = ['Editor 1'];

      // Setup mocks
      (TMDBService.prototype.getMoviesByYear as jest.Mock).mockResolvedValue(mockMovies);
      (TMDBService.prototype.getMovieCredits as jest.Mock).mockResolvedValue(mockEditors);

      // Execute
      await movieController.getMoviesByYear(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockJson).toHaveBeenCalledWith([{
        title: 'Test Movie',
        release_date: 'Unknown Release Date',
        vote_average: 8.5,
        editors: mockEditors
      }]);
    });
  });
});
