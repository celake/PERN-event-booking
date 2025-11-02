import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a pool to connect to Postgres
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'charlotte',
  host: process.env.POSTGRES_HOST || 'localhost', // use 'db' if running from another container
  database: process.env.POSTGRES_DB || 'eventbooking',
  password: process.env.POSTGRES_PASSWORD || 'nfX1RfjsqEnnE3fZ145i',
  port: Number(process.env.POSTGRES_PORT) || 5433,
});

const run = async () => {
  try {
    // Simple test table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    console.log('Test table created successfully!');

    // Optional: insert a row to test insert
    await pool.query(`INSERT INTO test_table (name) VALUES ($1)`, ['Hello World']);
    const res = await pool.query(`SELECT * FROM test_table`);
    console.log('Test table contents:', res.rows);
  } catch (err) {
    console.error('Error connecting or querying Postgres:', err);
  } finally {
    await pool.end(); // close pool connections
  }
};

run();