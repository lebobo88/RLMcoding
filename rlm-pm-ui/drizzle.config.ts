import { defineConfig } from "drizzle-kit";
import path from "path";

// Get the database path
const appDataPath = process.env.APPDATA || process.env.HOME || ".";
const dbPath = path.join(appDataPath, "rlm-pm-ui", "rlm-pm.db");

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
