import { db } from "./db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { channels } from "@shared/schema";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BACKUP_DIR = path.join(dirname(__dirname), "backups");

export async function backupDatabase() {
  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Get all channels data
    const channelsData = await db.select().from(channels);

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

    // Save data to file
    fs.writeFileSync(backupPath, JSON.stringify(channelsData, null, 2));

    console.log(`Database backup created at ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error("Failed to create database backup:", error);
    throw error;
  }
}

export async function restoreDatabase(backupPath: string) {
  try {
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    // Clear existing data
    await db.delete(channels);

    // Insert backed up data
    if (backupData.length > 0) {
      await db.insert(channels).values(backupData);
    }

    console.log(`Database restored from ${backupPath}`);
  } catch (error) {
    console.error("Failed to restore database:", error);
    throw error;
  }
}

// Schedule automatic backups (every 24 hours)
export function scheduleBackups() {
  const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  setInterval(async () => {
    try {
      await backupDatabase();

      // Keep only last 7 backups
      const files = fs.readdirSync(BACKUP_DIR);
      if (files.length > 7) {
        const oldestFiles = files
          .map(file => ({ file, time: fs.statSync(path.join(BACKUP_DIR, file)).mtime }))
          .sort((a, b) => a.time.getTime() - b.time.getTime())
          .slice(0, files.length - 7);

        oldestFiles.forEach(({ file }) => {
          fs.unlinkSync(path.join(BACKUP_DIR, file));
        });
      }
    } catch (error) {
      console.error("Automatic backup failed:", error);
    }
  }, BACKUP_INTERVAL);
}