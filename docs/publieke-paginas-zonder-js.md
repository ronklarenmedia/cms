# Openbare pagina's zonder JavaScript

Stand: 21 september 2026. Een openbare klantpagina is **HTML en CSS en levert geen JavaScript mee**: geen React, geen hydratatie,
geen bundel. Dat is de kern van "supersnelle, goed vindbare sites". Dit document legt uit hoe het werkt, en vooral: **wat je doet als je
tóch JavaScript nodig hebt**, bijvoorbeeld voor een animatie.

## Wat het oplevert

Gemeten op de live testsite, dezelfde pagina, dezelfde inhoud (de HTML-opbouw is regel voor regel identiek, behalve de scripts):

| | Voor | Nu |
|---|---|---|
| JavaScript | 171 KB gzip in 8 bestanden (React-runtime, ook zonder één interactief block) | **0 KB**, geen scriptbestanden |
| Scripttags | 14 | 1 (JSON-LD: gegevens voor zoekmachines, geen code) |
| HTML | ~7 KB gzip, plus een apart CSS-bestand | ~10 KB gzip **met de CSS ingebouwd**: één aanvraag |
| Aanvragen om de pagina te tonen | HTML, 3 CSS, 8 JS, lettertype, afbeeldingen | HTML, lettertype, afbeeldingen |

## Hoe het werkt

- **Een route-handler in plaats van een pagina** (`src/app/(sites)/s/[host]/[[...pagina]]/route.ts`). Een Next-pagina levert altijd de
  React-runtime mee. De handler bouwt de pagina met `react-dom/static` (`prerender`) tot een HTML-document (`src/lib/site-html.tsx`).
- **De CSS staat ingebouwd** (`src/lib/site-css.ts`): `blocks.css` en de `styles.css` van elk block, samengevoegd bij het opstarten.
- **De `<head>`** (titel, omschrijving, robots, canonical, Open Graph, Twitter) staat in `site-html.tsx`; er is geen `generateMetadata`.
- **Cache (ISR):** elke pagina wordt bij het eerste bezoek opgebouwd en daarna gecachet. Publiceren laat de pagina's van die site direct
  verlopen met een **tag per host** (`live:<host>`, zie STATUS.md §6). Vangnet: `revalidate = 600`.
- **Favicon:** per site (upload of automatisch icoon), ook op `/favicon.ico`; zie STATUS.md §3.
- **Lettertypes** komen zelf gehost van het eigen domein van de klantsite (`public/fonts/`), en zijn onderdeel van dezelfde HTML.

## Wat als je JavaScript nodig hebt?

Denk in drie stappen en stop bij de eerste die volstaat.

### 1. Kan het met CSS? (bijna altijd voor "simpele animaties")

Moderne CSS doet veel wat vroeger JavaScript vroeg. Alles hieronder werkt zonder script, en past bij de regel van de blocks:
alleen `var(--var-*)`-tokens en container queries.

- **Hover, focus en overgangen:** `transition`, `transform`, `:hover`, `:focus-visible`.
- **Inschuiven of verschijnen bij het scrollen:** scroll-gestuurde animaties, `animation-timeline: view()`. Zet ze in een
  `@supports (animation-timeline: view())`-blok, dan blijft de inhoud in oudere browsers gewoon zichtbaar en zonder animatie.
- **Verschijnen bij het laden van een element:** `@starting-style` en `@keyframes`.
- **Uitklappen, tabs, menu:** `<details>`/`<summary>`, `:target`, `:has()`, en een verborgen `<input type="checkbox">`. (Het mobiele
  menu en de video-facade doen dit al zo.)
- **Slider of carrousel:** `scroll-snap` met de knoppen als ankers (`#slide-2`).
- **Doorlopende band (marquee):** `@keyframes` op een `transform`.

Twee vaste regels voor elke animatie: respecteer `@media (prefers-reduced-motion: reduce)` (dan geen beweging), en laat de
inhoud zonder animatie volledig leesbaar zijn. Een voorbeeld dat in beide gevallen veilig is:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    [data-block] {
      animation: blk-verschijn linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
    @keyframes blk-verschijn { from { opacity: 0; transform: translateY(1rem); } }
  }
}
```

### 2. Kan het niet met CSS? Een klein losse script ("enhancement")

Voor wat CSS niet kan: getallen laten optellen, een lightbox, kopiëren naar het klembord, filteren van een lijst, een animatie in een
browser zonder scroll-gestuurde animaties. Zo'n script is **gewoon JavaScript, geen React**, en:

- **verrijkt** een pagina die zonder het script al volledig werkt (progressive enhancement);
- staat in `public/enhance/v1/<naam>.js` en wordt **geregistreerd** in `src/lib/enhancements.ts` met de block(s) waarvoor het geldt;
- wordt **alleen op pagina's geladen die dat block bevatten** (`<script type="module" src=…>`, dus uitgesteld) en een jaar gecachet;
- blijft **klein**: richtlijn hooguit ~3 KB gzip, geen afhankelijkheden;
- respecteert `prefers-reduced-motion`, gebruikt geen `eval` en leest geen persoonsgegevens.

Registreren:

```ts
// src/lib/enhancements.ts
export const ENHANCEMENTS: readonly Enhancement[] = [
  { id: "stats-tellers", blocks: ["stats"], purpose: "Telt de cijfers op zodra ze in beeld komen." },
];
```

Een bestaand bestand wijzigen? Gebruik een nieuwe map (`v2`) en pas `ENHANCE_DIR` aan: de bestanden zijn `immutable` gecachet.
Getest met een tijdelijk testscript: het staat alleen op de pagina met het geregistreerde block, niet op de andere, en wordt met
`Cache-Control: public, max-age=31536000, immutable` geserveerd.

### 3. Is het echt interactief? (formulier met validatie, winkelwagen, betaling)

Dat past **niet** in dit model zonder hydratatie, en die is er voor openbare pagina's bewust niet. Opties, van klein naar groot:

1. Een gewoon `<form>` dat naar een eigen API-route post, met een klein script (stap 2) voor de foutmeldingen.
2. Een web component (eigen HTML-element, ook gewone JavaScript) voor een afgebakend stuk interactie.
3. Pas als het echt niet anders kan: pagina's met zo'n block apart via een hydratatiepad laten lopen. Dat is een architectuurbesluit
   dat je bij het eerste zulke block moet nemen, en niet vooraf.

De regel "blocks bevatten geen client-JS" (`npm run check:blocks`) blijft dus gelden: een block levert HTML en CSS, en verwijst
desnoods naar een enhancement.

## Bekende beperkingen

- **Cursief en Latin-ext** bij de lettertypes: zie `public/fonts/README.md`.
- `unstable_cache` (voor de cache-tag) is in Next 16 verouderd en wordt door `use cache` vervangen; het werkt nog, en de vervanging
  vraagt Cache Components.

## Testen

Cachegedrag is **niet lokaal te testen met `npm run dev`** (die cachet niets). Bouw, start `next start` en:
- tel de scripts: `curl -H "Host: <sitenaam>.<preview-domein>" http://localhost:3000/ | grep -c "<script"`;
- lees de tags uit `.next/server/app/s/<host>.meta` (`x-next-cache-tags` moet `live:<host>` bevatten);
- laat een tag verlopen en kijk of `x-nextjs-cache` van `HIT` naar `MISS` springt, en alleen voor de juiste host.
