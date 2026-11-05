import "server-only";
import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { env } from "@/server/env";

/**
 * The single MySQL connection pool. Everything that touches the database goes
 * through `sql`, `sqlOne`, `exec` or `transaction` below, and every one of them
 * takes values as a separate parameter array — SQL text is never built from
 * user input. `multipleStatements` stays off so a stray `;` cannot chain a
 * second statement.
 */
const globalForDb = globalThis as unknown as { __leotechPool?: Pool };

function createPool(): Pool {
  const e = env();
  return mysql.createPool({
    host: e.DB_HOST,
    port: e.DB_PORT,
    user: e.DB_USER,
    password: e.DB_PASSWORD,
    database: e.DB_NAME,
    connectionLimit: e.DB_POOL_SIZE,
    waitForConnections: true,
    enableKeepAlive: true,
    multipleStatements: false,
    charset: "utf8mb4_unicode_ci",
    timezone: "Z",
    dateStrings: false,
    // TINYINT(1) → boolean
    typeCast(field, next) {
      if (field.type === "TINY" && field.length === 1) {
        const v = field.string();
        return v === null ? null : v === "1";
      }
      return next();
    },
  });
}

export function pool(): Pool {
  // Reuse across hot reloads in dev so we don't leak connections.
  if (!globalForDb.__leotechPool) globalForDb.__leotechPool = createPool();
  return globalForDb.__leotechPool;
}

type Param = string | number | boolean | Date | null | Buffer;
type Queryable = Pick<PoolConnection, "execute">;

/** Rows for a SELECT. Uses server-side prepared statements. */
export async function sql<T>(text: string, params: Param[] = [], db: Queryable = pool()): Promise<T[]> {
  const [rows] = await db.execute<RowDataPacket[]>(text, params);
  return rows as unknown as T[];
}

export async function sqlOne<T>(text: string, params: Param[] = [], db: Queryable = pool()): Promise<T | null> {
  const rows = await sql<T>(text, params, db);
  return rows[0] ?? null;
}

/** INSERT / UPDATE / DELETE. */
export async function exec(text: string, params: Param[] = [], db: Queryable = pool()): Promise<ResultSetHeader> {
  const [res] = await db.execute<ResultSetHeader>(text, params);
  return res;
}

export async function transaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/** mysql2 error code for a UNIQUE constraint violation. */
export const isDuplicateKey = (err: unknown) =>
  typeof err === "object" && err !== null && (err as { code?: string }).code === "ER_DUP_ENTRY";
