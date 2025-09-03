import { defineConfig } from "drizzle-kit";
import { join } from "path";

export default defineConfig({
  schema: [
    "./src/server/database/schema.ts",
    "./src/server/database/auth-schema.ts",
  ],
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      join(process.cwd(), "src/server/database/sqlite.db"),
  },
  verbose: process.env.NODE_ENV === "development",
  strict: true,
});
