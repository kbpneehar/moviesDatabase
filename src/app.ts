import express from 'express';
import movieRoutes from './routes/movie.routes.js';

const app = express();

app.use('/movies', movieRoutes);

export default app;