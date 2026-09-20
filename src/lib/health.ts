import { AwsClient } from "aws4fetch";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getR2Config, missingR2Vars } from "./r2";

export type DatabaseHealth = { ok: true; ms: number; region: string | null } | { ok: false };

/** Regio van een Neon-verbinding (bijv. eu-central-1) uit de hostnaam; nooit de hostnaam of inloggegevens zelf. */
function neonRegion(url: string | undefined): string | null {
  return url?.match(/\.([a-z]{2}-[a-z]+-\d)\.(?:aws|azure)\.neon\.tech/)?.[1] ?? null;
}

/** Een echte controle: één lichte query, met de tijd die het antwoord kostte. */
export async function checkDatabase(): Promise<DatabaseHealth> {
  const started = performance.now();
  try {
    await db.execute(sql`select 1`);
    return { ok: true, ms: Math.round(performance.now() - started), region: neonRegion(process.env.DATABASE_URL) };
  } catch {
    return { ok: false };
  }
}

export type StorageHealth =
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; reason: "auth" | "not-found" | "unreachable" | "unexpected"; httpStatus?: number }
  | { status: "ok"; ms: number; publicUrl: "reachable" | "unreachable" | "not-set" };

const TIMEOUT_MS = 5000;

/** Elke HTTP-respons (ook een 404) bewijst dat het adres bereikbaar is; alleen een netwerk- of certificaatfout niet. */
async function isReachable(url: string): Promise<boolean> {
  try {
    await fetch(url, { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    return true;
  } catch {
    return false;
  }
}

/**
 * Een echte controle van R2: een ondertekende HEAD op de bucket (bewijst dat sleutels, endpoint en bucketnaam
 * kloppen, zonder iets te schrijven), plus of de openbare URL bereikbaar is. Toont nooit sleutels of adressen.
 */
export async function checkStorage(): Promise<StorageHealth> {
  const config = getR2Config();
  if (!config) return { status: "unconfigured", missing: missingR2Vars() };

  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const started = performance.now();
  const [bucket, publicUrl] = await Promise.all([
    client
      .fetch(`${config.endpoint}/${config.bucket}`, { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) })
      .then((res) => ({ httpStatus: res.status, ms: Math.round(performance.now() - started) }))
      .catch(() => null),
    config.publicUrl ? isReachable(config.publicUrl) : Promise.resolve(null),
  ]);

  if (!bucket) return { status: "error", reason: "unreachable" };
  if (bucket.httpStatus === 401 || bucket.httpStatus === 403) return { status: "error", reason: "auth", httpStatus: bucket.httpStatus };
  if (bucket.httpStatus === 404) return { status: "error", reason: "not-found", httpStatus: 404 };
  if (bucket.httpStatus < 200 || bucket.httpStatus >= 300) return { status: "error", reason: "unexpected", httpStatus: bucket.httpStatus };

  return {
    status: "ok",
    ms: bucket.ms,
    publicUrl: publicUrl === null ? "not-set" : publicUrl ? "reachable" : "unreachable",
  };
}
