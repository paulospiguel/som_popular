import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/infra/database/schema.ts",
    "./src/infra/database/auth-schema.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/som_popular",
  },
  verbose: process.env.NODE_ENV === "development",
  strict: true,
});
