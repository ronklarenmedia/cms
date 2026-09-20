// Cloudflare R2 (S3-compatibel) voor uploads. Alleen op de server gebruiken. De sleutels komen uit de
// omgeving (.env.local of de hosting) en worden nergens getoond of gelogd.

export type R2Config = {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Basis-URL waaronder bestanden openbaar staan (zonder slash aan het eind); nog niet ingesteld = null. */
  publicUrl: string | null;
};

const REQUIRED = ["R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ENDPOINT", "R2_BUCKET"] as const;

const env = (name: string) => process.env[name]?.trim() ?? "";

/** Namen (nooit waarden) van de verplichte variabelen die nog leeg zijn. */
export const missingR2Vars = (): string[] => REQUIRED.filter((name) => !env(name));

/** De volledige configuratie, of null zolang er verplichte variabelen ontbreken. */
export function getR2Config(): R2Config | null {
  if (missingR2Vars().length > 0) return null;
  return {
    endpoint: env("R2_ENDPOINT").replace(/\/+$/, ""),
    bucket: env("R2_BUCKET"),
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    publicUrl: env("R2_PUBLIC_URL").replace(/\/+$/, "") || null,
  };
}
