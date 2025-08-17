import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Criar a base de dados SQLite
const sqlite = new Database("sqlite.db");

// Configurar o Drizzle
export const db = drizzle(sqlite, { schema });

// Exportar o tipo da base de dados
export type Database = typeof db;
