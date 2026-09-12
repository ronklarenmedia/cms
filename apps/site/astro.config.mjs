import { defineConfig } from "astro/config";

// Eén codebase, N keer gebouwd — één keer per klantsite.
// SITE_ID bepaalt tijdens de build (en tijdens preview-requests) van welke
// site de data uit Payload wordt opgehaald. Zie apps/cms voor het datamodel
// en het architectuurdocument voor de achtergrond van deze aanpak.
export default defineConfig({
  output: "static", // later per preview-route uit te breiden naar hybrid/SSR (zie doc §4)
});
