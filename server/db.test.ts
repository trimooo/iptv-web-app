import { initializeDatabase, closeDatabase } from './db';

async function testConnection() {
  try {
    await initializeDatabase();
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
  } finally {
    await closeDatabase();
  }
}

testConnection();