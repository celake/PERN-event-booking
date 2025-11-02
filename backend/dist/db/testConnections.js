var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simple test table
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
        console.log('Test table created successfully!');
        // Optional: insert a row to test insert
        yield pool.query(`INSERT INTO test_table (name) VALUES ($1)`, ['Hello World']);
        const res = yield pool.query(`SELECT * FROM test_table`);
        console.log('Test table contents:', res.rows);
    }
    catch (err) {
        console.error('Error connecting or querying Postgres:', err);
    }
    finally {
        yield pool.end(); // close pool connections
    }
});
run();
