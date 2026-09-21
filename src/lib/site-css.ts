import { readFileSync } from "node:fs";
import path from "node:path";

// De CSS van een openbare site, samengevoegd tot één tekst die als <style> in de pagina komt: geen apart bestand, dus geen extra aanvraag
// en geen bundler nodig. Alleen op de server. blocks.css importeert de styles.css van elk block; die @imports worden hier ingevuld.
// Het resultaat wordt per serverinstantie één keer opgebouwd. De bestanden moeten in de serverbundel zitten: zie outputFileTracingIncludes in next.config.ts.

const ROOT = process.cwd();
const FILES = ["src/blocks/blocks.css", "src/app/(sites)/sites.css", "src/app/(beheer)/websites/site-frame.css"];

/** Leest een CSS-bestand en vervangt elke `@import "./x.css";` door de inhoud van dat bestand (relatief aan het bestand zelf). */
function withImports(file: string, seen: Set<string> = new Set()): string {
  if (seen.has(file)) return ""; // een import-lus of dubbele import
  seen.add(file);
  const css = readFileSync(file, "utf8");
  return css.replace(/@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g, (_match, target: string) => withImports(path.resolve(path.dirname(file), target), seen));
}

/** Haalt commentaar en overtollige witruimte weg. Voorzichtig: alleen rond accolades, puntkomma's en komma's, nooit binnen een waarde. */
const minify = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,])\s*/g, "$1")
    .trim();

let cached: string | null = null;

/** De volledige CSS voor een openbare pagina. */
export function siteCss(): string {
  if (cached === null) {
    const seen = new Set<string>();
    cached = minify(FILES.map((f) => withImports(path.join(ROOT, f), seen)).join("\n"));
  }
  return cached;
}
