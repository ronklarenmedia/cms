/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_ID: string;
  readonly PAYLOAD_API_URL: string;
  readonly PAYLOAD_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
