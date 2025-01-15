import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller.js';


const router = Router();
const movieController = new MovieController();

router.get('/:year', (req, res) => movieController.getMoviesByYear(req, res));

export default router;