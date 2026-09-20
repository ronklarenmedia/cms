import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ontbreekt — zie .env.example");
}

// sslmode uit de URL knippen en als los ssl-object doorgeven: voorkomt de
// pg-connection-string deprecation-warning over 'sslmode=require' als alias.
// Het scheidingsteken ("?" of "&") blijft staan als er nog een parameter volgt, anders vervalt het.
const connectionString = process.env.DATABASE_URL.replace(/([?&])sslmode=[^&]*(&?)/, (_, separator: string, more: string) => (more ? separator : ""));
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

export const db = drizzle(pool, { schema });
