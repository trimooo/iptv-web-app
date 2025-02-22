import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { scheduleBackups, backupDatabase } from './db-backup';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize database and start backup schedule
export async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Run migrations
    await migrate(db, {
      migrationsFolder: path.join(dirname(__dirname), 'migrations'),
    });
    console.log("Migrations completed successfully");

    // Create initial backup
    await backupDatabase();

    // Start automatic backup schedule
    scheduleBackups();

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}