import { Pool, type QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForDb = global as typeof globalThis & { pgPool?: Pool };

export const pool =
  globalForDb.pgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}
