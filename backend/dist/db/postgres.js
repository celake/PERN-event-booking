import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'charlotte',
    host: process.env.POSTGRES_HOST || 'localhost', // use 'db' if running from another container
    database: process.env.POSTGRES_DB || 'eventbooking',
    password: process.env.POSTGRES_PASSWORD || 'nfX1RfjsqEnnE3fZ145i',
    port: Number(process.env.POSTGRES_PORT) || 5433,
});
export const query = (text, params) => pool.query(text, params);
