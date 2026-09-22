// Client-veilig deel van het eigen-lettertype-uploadsysteem (zie custom-fonts.ts voor de server-only opslaglogica,
// die node:crypto en aws4fetch importeert en dus nooit in een clientbundel mag belanden).

export const FONT_WEIGHTS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
export type FontWeight = (typeof FONT_WEIGHTS)[number];

export const FONT_WEIGHT_LABEL: Record<FontWeight, string> = {
  "100": "100 — Dun",
  "200": "200 — Extra licht",
  "300": "300 — Licht",
  "400": "400 — Normaal",
  "500": "500 — Medium",
  "600": "600 — Halfvet",
  "700": "700 — Vet",
  "800": "800 — Extra vet",
  "900": "900 — Zwart",
};
