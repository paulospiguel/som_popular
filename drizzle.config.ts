import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/database/schema.ts", "./src/database/auth-schema.ts"],
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./sqlite.db",
  },
});
