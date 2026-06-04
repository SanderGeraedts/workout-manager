import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import * as schema from "./schema.js";
import * as relations from "./relations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDbPath = resolve(__dirname, "../../../data/workout.db");

const sqlite = new Database(process.env.DATABASE_URL || defaultDbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });
export * from "./schema.js";
export * from "./relations.js";
