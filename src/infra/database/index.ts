import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

//import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/som_popular";
const logger = process.env.NODE_ENV === "development";

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {},
});

export const db = drizzle(client, {
  logger,
  //  schema,
});
