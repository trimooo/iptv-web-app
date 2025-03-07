import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Database connection configuration
const createPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set in .env file");
  }

  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
};

export const pool = createPool();
export const db = drizzle(pool, { schema: { channels: schema.channels } });

// Initialize database and start backup schedule
export async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    const client = await pool.connect();
    console.log("Database connection successful");
    await client.release();

    await migrate(db, {
      migrationsFolder: path.join(__dirname, '..', 'migrations'),
    });
    console.log("Migrations completed successfully");

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

// Cleanup function
export async function closeDatabase() {
  await pool.end();
}