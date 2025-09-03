import { join } from "path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(
  process.env.DATABASE_URL?.replace("file:", "") ??
    join(process.cwd(), "src/server/database/sqlite.db")
);

const logger = process.env.NODE_ENV === "development";

export const db = drizzle(sqlite, {
  logger,
});
