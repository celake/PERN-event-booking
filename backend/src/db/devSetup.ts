import { query } from "./postgres.js";
import { initializePostgres } from './initializePostgres.js';
import { seedDatabase } from '../seeds/seeds.js';

const run = async () => {
  try {
    await initializePostgres(); 
    await seedDatabase();       
    console.log('Database initialized and seeded for dev!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

run();