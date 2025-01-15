import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  TMDB_API_KEY: str(),
  PORT: str({ default: '3000' })
});
console.log("API Key:", process.env.TMDB_API_KEY);