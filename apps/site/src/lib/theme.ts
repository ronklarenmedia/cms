// Zet een site.theme-object (uit Payload) om naar CSS custom properties.
// Veldnamen komen 1:1 overeen met apps/cms/src/collections/fields/themeFields.ts
// (zie ook .claude/skills/theme-field-schema/SKILL.md). Elke camelCase key
// wordt mechanisch omgezet naar zijn --var-kebab-case CSS-varnaam, dus een
// nieuw token in themeFields.ts hoeft hier niet apart toegevoegd te worden
// zolang de conventie standhoudt.
//
// Gekoppeld in src/pages/preview/[id].astro (mergeTheme + themeToCssVars).

export type SiteTheme = Partial<{
  // Typografie
  fontSizeXs: string;
  fontSizeSmall: string;
  fontSizeStandard: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  fontSizeXl: string;
  fontSizeXxl: string;
  fontFamilyPrimary: string;
  fontFamilySecondary: string;
  fontFamilyText: string;
  fontFamilyAccent: string;
  fontFamilyMono: string;
  fontWeightLight: string;
  fontWeightStandard: string;
  fontWeightMedium: string;
  fontWeightBold: string;
  fontWeightHeavy: string;
  lineHeightTight: string;
  lineHeightStandard: string;
  lineHeightRelaxed: string;
  lineHeightLoose: string;
  letterSpacingTight: string;
  letterSpacingStandard: string;
  letterSpacingWide: string;

  // Kleuren
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorText: string;
  colorBgPrimaryLight: string;
  colorBgPrimaryMedium: string;
  colorBgPrimaryDark: string;
  colorBgSecondaryLight: string;
  colorBgSecondaryMedium: string;
  colorBgSecondaryDark: string;
  colorWhite: string;
  colorOffWhite: string;
  colorLightGrey: string;
  colorMediumGrey: string;
  colorDarkGrey: string;
  colorOffBlack: string;
  colorBgBlack: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;

  // Vormgeving & Randen
  borderRadiusNone: string;
  borderRadiusSmall: string;
  borderRadiusStandard: string;
  borderRadiusMedium: string;
  borderRadiusLarge: string;
  borderRadiusFull: string;
  borderWidthNone: string;
  borderWidthThin: string;
  borderWidthStandard: string;
  borderWidthThick: string;
  boxShadowNone: string;
  boxShadowSmall: string;
  boxShadowStandard: string;
  boxShadowLarge: string;
  boxShadowXl: string;

  // Ruimte & Afmetingen
  spacingXs: string;
  spacingSmall: string;
  spacingStandard: string;
  spacingMedium: string;
  spacingLarge: string;
  spacingXl: string;
  spacingXxl: string;
  maxWidthSmall: string;
  maxWidthStandard: string;
  maxWidthMedium: string;
  maxWidthLarge: string;
  maxWidthFull: string;

  // Media & Objecten
  aspectRatioSquare: string;
  aspectRatioVideo: string;
  aspectRatioPhoto: string;
  aspectRatioPortrait: string;

  // Interactie, Status & Lagen
  transitionFast: string;
  transitionStandard: string;
  transitionSlow: string;
  opacityLight: number;
  opacityStandard: number;
  opacityHeavy: number;
  opacitySolid: number;
  zIndexBase: number;
  zIndexAbove: number;
  zIndexDropdown: number;
  zIndexOverlay: number;
  zIndexModal: number;
}>;

function toKebabVar(key: string): string {
  return `--var-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
}

// Pagina-specifieke themeOverrides winnen per-veld van het site-thema —
// lege/null/undefined overrides erven gewoon door (zie Pages.themeOverrides
// admin-omschrijving: "leeg = erf van de site-instellingen").
export function mergeTheme(base: SiteTheme = {}, overrides: SiteTheme = {}): SiteTheme {
  const merged: SiteTheme = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined && value !== null && value !== "") {
      (merged as Record<string, unknown>)[key] = value;
    }
  }
  return merged;
}

export function themeToCssVars(theme: SiteTheme = {}): string {
  const lines = Object.entries(theme)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `  ${toKebabVar(key)}: ${value};`);

  return `:root {\n${lines.join("\n")}\n}`;
}
