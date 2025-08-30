import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/server/database/schema.ts",
    "./src/server/database/auth-schema.ts",
  ],
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./src/server/database/sqlite.db",
  },
});
