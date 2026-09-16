import type { Field } from "payload";

// Gedeeld veldenschema voor "theme": gebruikt in site-templates, sites.theme
// en pages.themeOverrides (waar alles optioneel blijft — leeg = erf van
// het niveau erboven, zie doc §1).
//
// Structuur en naamgeving volgen de theme-field-schema skill
// (.claude/skills/theme-field-schema/SKILL.md): 6 tabs, één per
// VARIABELEN-categorie uit het brondocument. Elke Payload-veldnaam is de
// camelCase-vorm van de bijbehorende CSS custom property, bv.
// --var-font-size-xs -> fontSizeXs. apps/site/src/lib/theme.ts leidt de
// kebab-case CSS-varnaam mechanisch af uit deze veldnamen.
//
// Dit zijn de tokendefinities zelf (concrete waarden). Een blockveld dat
// een token wil refereren (bv. "welke spacing voor deze padding") doet dat
// later via een select met deze presetnamen als opties — aparte, child-taak.
export function themeFields({ requireValues = false }: { requireValues?: boolean } = {}): Field[] {
  return [
    {
      type: "tabs",
      tabs: [
        { label: "Typografie", fields: typografieFields(requireValues) },
        { label: "Kleuren", fields: kleurenFields(requireValues) },
        { label: "Vormgeving & Randen", fields: vormgevingFields() },
        { label: "Ruimte & Afmetingen", fields: ruimteFields() },
        { label: "Media & Objecten", fields: mediaFields() },
        { label: "Interactie, Status & Lagen", fields: interactieFields() },
      ],
    },
  ];
}

function textField(name: string, { required = false, description }: { required?: boolean; description?: string } = {}): Field {
  return { name, type: "text", required, admin: description ? { description } : undefined };
}

function typografieFields(requireValues: boolean): Field[] {
  return [
    {
      type: "row",
      fields: [
        textField("fontSizeXs"),
        textField("fontSizeSmall"),
        textField("fontSizeStandard", { required: requireValues, description: "bv. 1rem" }),
        textField("fontSizeMedium"),
      ],
    },
    {
      type: "row",
      fields: [textField("fontSizeLarge"), textField("fontSizeXl"), textField("fontSizeXxl")],
    },
    {
      type: "row",
      fields: [
        textField("fontFamilyPrimary", { required: requireValues, description: "bv. Inter, sans-serif" }),
        textField("fontFamilySecondary"),
      ],
    },
    {
      type: "row",
      fields: [textField("fontFamilyText"), textField("fontFamilyAccent"), textField("fontFamilyMono")],
    },
    {
      type: "row",
      fields: [
        textField("fontWeightLight"),
        textField("fontWeightStandard"),
        textField("fontWeightMedium"),
        textField("fontWeightBold"),
        textField("fontWeightHeavy"),
      ],
    },
    {
      type: "row",
      fields: [
        textField("lineHeightTight"),
        textField("lineHeightStandard"),
        textField("lineHeightRelaxed"),
        textField("lineHeightLoose"),
      ],
    },
    {
      type: "row",
      fields: [textField("letterSpacingTight"), textField("letterSpacingStandard"), textField("letterSpacingWide")],
    },
  ];
}

function kleurenFields(requireValues: boolean): Field[] {
  const hex = { description: "Hex-waarde, bv. #4338ca" };
  return [
    {
      type: "row",
      fields: [
        textField("colorPrimary", { required: requireValues, ...hex }),
        textField("colorSecondary", hex),
        textField("colorAccent", hex),
        textField("colorText", hex),
      ],
    },
    {
      type: "row",
      fields: [textField("colorBgPrimaryLight", hex), textField("colorBgPrimaryMedium", hex), textField("colorBgPrimaryDark", hex)],
    },
    {
      type: "row",
      fields: [
        textField("colorBgSecondaryLight", hex),
        textField("colorBgSecondaryMedium", hex),
        textField("colorBgSecondaryDark", hex),
      ],
    },
    {
      type: "row",
      fields: [
        textField("colorWhite", hex),
        textField("colorOffWhite", hex),
        textField("colorLightGrey", hex),
        textField("colorMediumGrey", hex),
      ],
    },
    {
      type: "row",
      fields: [textField("colorDarkGrey", hex), textField("colorOffBlack", hex), textField("colorBgBlack", hex)],
    },
    {
      type: "row",
      fields: [
        textField("colorSuccess", { description: "Hex-waarde. Status-kleuren: nodig voor formulier-validaties en notificaties." }),
        textField("colorWarning", hex),
        textField("colorError", hex),
      ],
    },
  ];
}

function vormgevingFields(): Field[] {
  return [
    {
      type: "row",
      fields: [
        textField("borderRadiusNone"),
        textField("borderRadiusSmall"),
        textField("borderRadiusStandard"),
      ],
    },
    {
      type: "row",
      fields: [textField("borderRadiusMedium"), textField("borderRadiusLarge"), textField("borderRadiusFull")],
    },
    {
      type: "row",
      fields: [
        textField("borderWidthNone"),
        textField("borderWidthThin"),
        textField("borderWidthStandard"),
        textField("borderWidthThick"),
      ],
    },
    {
      type: "row",
      fields: [
        textField("boxShadowNone"),
        textField("boxShadowSmall", { description: "bv. 0 1px 2px rgba(0,0,0,.1)" }),
        textField("boxShadowStandard"),
      ],
    },
    {
      type: "row",
      fields: [textField("boxShadowLarge"), textField("boxShadowXl")],
    },
  ];
}

function ruimteFields(): Field[] {
  return [
    {
      type: "row",
      fields: [textField("spacingXs"), textField("spacingSmall"), textField("spacingStandard"), textField("spacingMedium")],
    },
    {
      type: "row",
      fields: [textField("spacingLarge"), textField("spacingXl"), textField("spacingXxl")],
    },
    {
      type: "row",
      fields: [textField("maxWidthSmall"), textField("maxWidthStandard"), textField("maxWidthMedium")],
    },
    {
      type: "row",
      fields: [textField("maxWidthLarge"), textField("maxWidthFull")],
    },
  ];
}

function mediaFields(): Field[] {
  return [
    {
      type: "row",
      fields: [
        textField("aspectRatioSquare", { description: "1:1 — dwingt geüploade afbeeldingen via object-fit: cover in een vast grid." }),
        textField("aspectRatioVideo", { description: "16:9" }),
        textField("aspectRatioPhoto", { description: "4:3" }),
        textField("aspectRatioPortrait", { description: "3:4" }),
      ],
    },
  ];
}

function interactieFields(): Field[] {
  return [
    {
      type: "row",
      fields: [
        textField("transitionFast", { description: "bv. 100ms ease" }),
        textField("transitionStandard"),
        textField("transitionSlow"),
      ],
    },
    {
      type: "row",
      fields: [
        { name: "opacityLight", type: "number", min: 0, max: 1, admin: { step: 0.05 } },
        { name: "opacityStandard", type: "number", min: 0, max: 1, admin: { step: 0.05 } },
        { name: "opacityHeavy", type: "number", min: 0, max: 1, admin: { step: 0.05 } },
        { name: "opacitySolid", type: "number", min: 0, max: 1, admin: { step: 0.05 } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "zIndexBase", type: "number" },
        { name: "zIndexAbove", type: "number" },
        { name: "zIndexDropdown", type: "number" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "zIndexOverlay", type: "number" },
        { name: "zIndexModal", type: "number" },
      ],
    },
  ];
}
