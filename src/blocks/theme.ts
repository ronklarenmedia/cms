// Site-thema: de ~87 design-tokens uit .claude/skills/theme-field-schema (sectie C).
// Een token heet in code camelCase (`fontSizeXs`) en in CSS `--var-font-size-xs`.
// Blocks gebruiken uitsluitend deze `--var-*`-variabelen; de waarden komen van het thema
// van de klantsite. `defaultTheme` is de volledige set waar elk siteThema op wordt gemerged.
import type { CSSProperties } from "react";

export const defaultTheme = {
  // Typografie
  fontSizeXs: "0.75rem",
  fontSizeSmall: "0.875rem",
  fontSizeStandard: "1rem",
  fontSizeMedium: "1.125rem",
  fontSizeLarge: "1.5rem",
  fontSizeXl: "2rem",
  fontSizeXxl: "3rem",
  fontFamilyPrimary: "Inter, sans-serif",
  fontFamilySecondary: "Georgia, serif",
  fontFamilyText: "Inter, sans-serif",
  fontFamilyAccent: "Inter, sans-serif",
  fontFamilyMono: "ui-monospace, monospace",
  fontWeightLight: "300",
  fontWeightStandard: "400",
  fontWeightMedium: "500",
  fontWeightBold: "700",
  fontWeightHeavy: "800",

  // 
  lineHeightTight: "1.1",
  lineHeightStandard: "1.5",
  lineHeightRelaxed: "1.65",
  lineHeightLoose: "1.9",
  letterSpacingTight: "-0.02em",
  letterSpacingStandard: "0",
  letterSpacingWide: "0.05em",

  // Kleuren
  colorPrimary: "#4338ca",
  colorSecondary: "#6366f1",
  colorAccent: "#f59e0b",
  colorText: "#18181b",
  colorBgPrimaryLight: "#eef2ff",
  colorBgPrimaryMedium: "#c7d2fe",
  colorBgPrimaryDark: "#3730a3",
  colorBgSecondaryLight: "#f5f3ff",
  colorBgSecondaryMedium: "#ddd6fe",
  colorBgSecondaryDark: "#5b21b6",
  colorWhite: "#ffffff",
  colorOffWhite: "#fafafa",
  colorLightGrey: "#e4e4e7",
  colorMediumGrey: "#a1a1aa",
  colorDarkGrey: "#52525b",
  colorOffBlack: "#18181b",
  colorBgBlack: "#09090b",
  colorSuccess: "#16a34a",
  colorWarning: "#f59e0b",
  colorError: "#dc2626",

  // Vormgeving & randen
  borderRadiusNone: "0",
  borderRadiusSmall: "0.25rem",
  borderRadiusStandard: "0.5rem",
  borderRadiusMedium: "0.75rem",
  borderRadiusLarge: "1rem",
  borderRadiusFull: "9999px",
  borderWidthNone: "0",
  borderWidthThin: "1px",
  borderWidthStandard: "2px",
  borderWidthThick: "4px",
  boxShadowNone: "none",
  boxShadowSmall: "0 1px 2px rgba(0,0,0,.06)",
  boxShadowStandard: "0 2px 8px rgba(0,0,0,.1)",
  boxShadowLarge: "0 8px 24px rgba(0,0,0,.14)",
  boxShadowXl: "0 24px 48px rgba(0,0,0,.18)",

  // Ruimte & afmetingen
  spacingXs: "0.25rem",
  spacingSmall: "0.5rem",
  spacingStandard: "1rem",
  spacingMedium: "1.5rem",
  spacingLarge: "2rem",
  spacingXl: "3rem",
  spacingXxl: "4.5rem",
  maxWidthSmall: "640px",
  maxWidthStandard: "768px",
  maxWidthMedium: "1024px",
  maxWidthLarge: "1280px",
  maxWidthFull: "100%",

  // Media
  aspectRatioSquare: "1/1",
  aspectRatioVideo: "16/9",
  aspectRatioPhoto: "4/3",
  aspectRatioPortrait: "3/4",

  // Interactie & lagen
  transitionFast: "100ms ease",
  transitionStandard: "200ms ease",
  transitionSlow: "400ms ease",
  opacityLight: 0.25,
  opacityStandard: 0.5,
  opacityHeavy: 0.75,
  opacitySolid: 1,
  zIndexBase: 0,
  zIndexAbove: 10,
  zIndexDropdown: 100,
  zIndexOverlay: 500,
  zIndexModal: 1000,
} as const;

export type ThemeToken = keyof typeof defaultTheme;
export type SiteTheme = Partial<Record<ThemeToken, string | number>>;

const toCssVar = (token: string) => "--var-" + token.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

/** Alle geldige CSS-variabelen (`--var-font-size-xs`, …); de checker gebruikt dit om typefouten te vangen. */
export const TOKEN_VARS: readonly string[] = Object.keys(defaultTheme).map(toCssVar);

/** Voorbeeldthema's voor de showcase: bewijzen dat blocks alleen de tokens volgen. */
export const themes = {
  corporate: { label: "Corporate", theme: {} as SiteTheme },
  warm: {
    label: "Warm",
    theme: {
      colorPrimary: "#c2410c",
      colorSecondary: "#ea580c",
      colorAccent: "#0f766e",
      colorText: "#292524",
      colorBgPrimaryLight: "#fff7ed",
      colorBgPrimaryMedium: "#fed7aa",
      colorBgPrimaryDark: "#9a3412",
      colorBgSecondaryLight: "#f0fdfa",
      colorBgSecondaryMedium: "#99f6e4",
      colorBgSecondaryDark: "#115e59",
      colorOffWhite: "#fafaf9",
      colorLightGrey: "#e7e5e4",
      fontFamilyPrimary: "Georgia, \"Times New Roman\", serif",
      borderRadiusStandard: "0.25rem",
      borderRadiusMedium: "0.375rem",
      borderRadiusLarge: "0.5rem",
    } as SiteTheme,
  },
} as const;

export type ThemeId = keyof typeof themes;

/** Merge een siteThema op de defaults en zet het om naar CSS custom properties voor een wrapper-element. */
export function themeToCssVars(theme: SiteTheme = {}): CSSProperties {
  const merged: Record<string, string | number> = { ...defaultTheme, ...theme };
  const vars: Record<string, string | number> = {};
  for (const [token, value] of Object.entries(merged)) vars[toCssVar(token)] = value;
  return vars as CSSProperties;
}
