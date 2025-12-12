import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Get the database path - store in user's app data directory
const getDbPath = () => {
  const appDataPath = process.env.APPDATA || process.env.HOME || ".";
  const dbDir = path.join(appDataPath, "rlm-pm-ui");

  // Ensure directory exists
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  return path.join(dbDir, "rlm-pm.db");
};

// Create SQLite connection
const sqlite = new Database(getDbPath());

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for use in other files
export * from "./schema";
