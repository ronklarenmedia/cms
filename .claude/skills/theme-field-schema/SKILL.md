---
name: theme-field-schema
description: Reference for which CSS properties get direct CMS fields (primary), which go behind an "Advanced" accordion (secondary), and which get no CMS field at all (custom-CSS only) — plus the full design-token variable taxonomy and Payload field-type mapping. Use when defining or editing fields for page-builder blocks, block "Instellingen" tabs, or theme/token schemas in apps/cms/src/blocks or apps/cms/src/collections/fields.
---

# Theme & CSS-veldenschema

**Filosofie (leidend voor elke keuze hieronder):** dit CMS bouwt voor snelheid en AI/LLM-doorzoekbaarheid, niet voor visuele originaliteit per site. Geen losse/verspreide `<style>`-blokken per component of block — styling loopt via de gedeelde theme-tokens (sectie C) en de globale basis-CSS. Elk block dat zelf een `<style>`-blok of scoped CSS introduceert, is een uitzondering die je moet kunnen verantwoorden, niet de standaard.

Bron: door de gebruiker aangeleverd overzicht (`~/Documents/CSS elementen en eigenschappen overzicht.rtf`). Dit is de canonieke referentie voor twee losse dingen — houd ze uit elkaar:

1. **Blockvelden** (secties A/B hieronder) — welke CSS-eigenschappen van een HTML-element/component een eigen Payload-veld krijgen wanneer je een nieuw block of een "Instellingen"-tab van een block bouwt.
2. **Site-thema tokens** (sectie C) — de vaste schaal van ~87 `--var-*` design tokens die op de Thema-tab van een site (zie `apps/cms/src/collections/fields/themeFields.ts`) worden gedefinieerd. Een blockveld dat een token wil *gebruiken* (bijv. "welke spacing-stap") doet dat later via een `select` met deze tokennamen als opties — dat is een aparte, child-taak, niet deze schema-definitie zelf.

## A — Primair vs. secundair per elementgroep

Voor deze 9 "veldgroepen" maak je Payload-veldgroepen aan. Primaire eigenschappen staan direct in de veldenlijst; secundaire eigenschappen gaan in een `type: "collapsible"` gelabeld **"Geavanceerd"** (patroon: zie `apps/cms/src/blocks/HeroBlock.ts`, de "Social proof badge"-collapsible).

| Veldgroep / Element(en) | Primair (zichtbaar) | Secundair (Geavanceerd) |
|---|---|---|
| Document Root (`html`, `body`) | font-family, font-size, color, background-color, line-height | -webkit-font-smoothing, box-sizing, margin |
| Containers & Layout (`main`, `section`, `header`, `footer`, `div`) | background-color, padding, margin, max-width | border, border-radius, box-shadow, gap, align-items, justify-content |
| Koppen (`h1`–`h6`) | font-family, font-size, font-weight, color, line-height | margin-top, margin-bottom, text-transform, letter-spacing |
| Tekstblokken (`p`, `span`) | font-size, color, line-height, margin-bottom | max-width, font-weight, column-count |
| Links (`a`) | color, text-decoration, font-weight | hover:color, text-underline-offset, transition |
| Knoppen (`button`) | background-color, color, padding, border-radius, font-weight | border, box-shadow, hover:background-color, transition |
| Formuliervelden (`input`, `textarea`, `select`) | background-color, border, border-radius, padding, font-size | focus:outline, focus:border-color, color, box-shadow |
| Afbeeldingen (`img`, `picture`) | border-radius, aspect-ratio | object-fit, box-shadow, filter |
| Standaard Lijsten (`ul`, `ol`, `li`) | list-style-type, padding-left, margin-bottom | color, gap (bij flex lists), list-style-position |

## B — Nooit een CMS-veld

Deze elementen krijgen **geen** eigen Payload-veld. Definieer ze eenmalig in de globale basis-CSS, of — als een specifiek block echt eenmalige controle nodig heeft — voeg één `customCss`-veld toe (`type: "textarea"` of `"code"`, onder "Geavanceerd"). Nooit een gestructureerd veld per losse property voor deze elementen:

| Categorie | Elementen |
|---|---|
| Inline typografie | `strong`, `b`, `em`, `i`, `small`, `mark` |
| Code & Citaten | `code`, `pre`, `blockquote`, `kbd` |
| Tabellen | `table`, `thead`, `tbody`, `tr`, `th`, `td` |
| Geavanceerde lijsten | `dl`, `dt`, `dd` |
| Complexe formulier-elementen | `fieldset`, `legend`, `label`, `input[type=radio]`, `input[type=checkbox]` |
| Geavanceerde Media & Embeds | `video`, `iframe`, `figure`, `figcaption`, `svg`, `path` |
| Interactieve elementen | `dialog`, `details`, `summary` |
| Scheidingstekens | `hr` |

Ze erven meestal standaardwaarden van `body`/`p`.

## C — Variabelen-taxonomie (site-thema tokens)

Alle namen volgen `--var-{categorie}-{variant}`. Dit is exact de set die `themeFields.ts` definieert (camelCase Payload-veldnaam ↔ kebab-case CSS-var, zie dat bestand).

**Typografie**
- font-size (7): xs, small, standard, medium, large, xl, xxl
- font-family (5): primary, secondary, text, accent, mono
- font-weight (5): light, standard, medium, bold, heavy
- line-height (4): tight, standard, relaxed, loose
- letter-spacing (3): tight, standard, wide

**Kleuren**
- color basis (4): primary, secondary, accent, text
- color bg-primary (3): light, medium, dark
- color bg-secondary (3): light, medium, dark
- color neutraal (7): white, off-white, light-grey, medium-grey, dark-grey, off-black, bg-black
- color status (3): success, warning, error — *nodig voor formulier-validaties en notificaties*

**Vormgeving & Randen**
- border-radius (6): none, small, standard, medium, large, full
- border-width (4): none, thin, standard, thick
- box-shadow (5): none, small, standard, large, xl

**Ruimte & Afmetingen**
- spacing / margin-padding (7): xs, small, standard, medium, large, xl, xxl
- max-width (5): small, standard, medium, large, full

**Media & Objecten**
- aspect-ratio (4): square (1:1), video (16:9), photo (4:3), portrait (3:4) — *essentieel om geüploade afbeeldingen via `object-fit: cover` in een vast grid te dwingen*

**Interactie, Status & Lagen**
- transition (3): fast, standard, slow
- opacity (4): light, standard, heavy, solid
- z-index (5): base, above, dropdown, overlay, modal

Totaal: 87 tokens.

## D — Payload-veldtype-mapping

- **Kleurwaarden** → `type: "text"` met `admin.description` "Hex-waarde, bv. #4338ca" (geen colorpicker-component in dit project — plain text is de precedent, zie `HeroBlock.ts`).
- **Font-family namen** → `type: "text"`.
- **Concrete CSS-waarde-definities op de Thema-pagina** (font-size, font-weight, line-height, letter-spacing, border-radius, border-width, box-shadow, spacing, max-width, aspect-ratio, transition) → `type: "text"` — dit zijn ruwe CSS-waardestrings (bv. `1rem`, `0 1px 2px rgba(0,0,0,.1)`, `200ms ease`, `16/9`), geen kale getallen.
- **Opacity** → `type: "number"`, `min: 0`, `max: 1`, `step: 0.05`.
- **Z-index** → `type: "number"`, integer.
- **Op blockniveau** (later, aparte taak): wanneer een block-veld een token wil *refereren* (bijv. "welke spacing voor deze padding") → `type: "select"` met de preset-namen (`xs`/`small`/`standard`/...) als opties, niet de waarde zelf.

## E — Mechaniek

- `type: "collapsible"` voor "Geavanceerd"-groepen (precedent: `HeroBlock.ts` "Social proof badge").
- `type: "row"` + `admin.width` voor compacte primaire-veldenparen naast elkaar (precedent: `HeroBlock.ts`).
- `admin.condition` alleen voor velden die echt volledig verborgen moeten worden (niet voor "Geavanceerd" — dat is `collapsible`, niet condition-based hiding).
