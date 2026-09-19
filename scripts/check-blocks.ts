// Controleert alle blocks tegen het contract in src/blocks/README.md.
// Draaien: `npm run check:blocks` — exit code 1 bij fouten, dus bruikbaar in CI en door AI-assistenten.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { z } from "zod";
import { BlockSection } from "../src/blocks/BlockRenderer";
import { CATEGORIES, sectionSchemaFor, type AnyBlock } from "../src/blocks/contract";
import { blocks } from "../src/blocks/registry";
import { TOKEN_VARS } from "../src/blocks/theme";

// BlockError toont alleen buiten productie iets; de checker wil die meldingen juist zien.
(process.env as Record<string, string>).NODE_ENV = "development";

const ROOT = join(__dirname, "..");
const BLOCKS_DIR = join(ROOT, "src/blocks");
const SLUG = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const STATUSES = ["kit-ready", "beta", "verouderd"];
const REQUIRED_FILES = ["index.ts", "schema.ts", "Component.tsx", "fixtures.ts", "styles.css"];
const H1_ALLOWED = new Set(["hero"]);
const FORBIDDEN_CONTENT_KEYS = /colou?r|background|bgcolor|css|classname|padding|margin|fontsize|fontfamily/i;
const NAMED_COLORS = "white|black|red|green|blue|gray|grey|yellow|orange|purple|pink|silver|navy|teal|maroon|olive|aqua|lime|fuchsia";

type Finding = { block: string; message: string; level: "fout" | "waarschuwing" };
const findings: Finding[] = [];
const fail = (block: string, message: string) => findings.push({ block, message, level: "fout" });
const warn = (block: string, message: string) => findings.push({ block, message, level: "waarschuwing" });

// ── helpers ───────────────────────────────────────────────────────────────────

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const rel = (p: string) => relative(ROOT, p);
const stripCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

function propertyNames(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) node.forEach((n) => propertyNames(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "properties" && v && typeof v === "object") Object.keys(v).forEach((p) => out.add(p));
      propertyNames(v, out);
    }
  }
  return out;
}

// ── 1. registry en mapstructuur ───────────────────────────────────────────────

const slugs = blocks.map((b) => b.slug);
if (new Set(slugs).size !== slugs.length) fail("registry", "Dubbele slugs in registry.ts");

const dirs = readdirSync(BLOCKS_DIR).filter((n) => statSync(join(BLOCKS_DIR, n)).isDirectory() && n !== "parts");
for (const dir of dirs) {
  if (!slugs.includes(dir)) fail(dir, `Map src/blocks/${dir}/ staat niet in registry.ts`);
}

const blocksCss = readFileSync(join(BLOCKS_DIR, "blocks.css"), "utf8");

// ── 2. per block: metadata, bestanden, fixtures, HTML ─────────────────────────

function checkMeta(b: AnyBlock) {
  const at = b.slug;
  if (!SLUG.test(b.slug)) fail(at, `slug "${b.slug}" moet kebab-case zijn`);
  if (!existsSync(join(BLOCKS_DIR, b.slug))) fail(at, `map src/blocks/${b.slug}/ bestaat niet (slug = mapnaam)`);
  if (!b.label.trim()) fail(at, "label ontbreekt");
  if (b.description.trim().length < 10) fail(at, "description ontbreekt of is te kort");
  if (!(CATEGORIES as readonly string[]).includes(b.category)) fail(at, `category "${b.category}" is geen van: ${CATEGORIES.join(", ")}`);
  if (!STATUSES.includes(b.status)) fail(at, `status "${b.status}" is geen van: ${STATUSES.join(", ")}`);
  if (!SLUG.test(b.icon)) fail(at, `icon "${b.icon}" moet een Phosphor-naam zijn zonder "ph-" (kebab-case)`);
  if (b.variants.length === 0) fail(at, "minstens één variant nodig");
  const ids = b.variants.map((v) => v.id);
  if (new Set(ids).size !== ids.length) fail(at, "dubbele variant-id's");
  for (const id of ids) if (!SLUG.test(id)) fail(at, `variant-id "${id}" moet kebab-case zijn`);

  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(BLOCKS_DIR, b.slug, file))) fail(at, `bestand ontbreekt: src/blocks/${b.slug}/${file}`);
  }
  if (!blocksCss.includes(`./${b.slug}/styles.css`)) fail(at, `styles.css is niet ge-importeerd in blocks.css (@import "./${b.slug}/styles.css";)`);

  // Inhoud is inhoud: geen kleur-, ruimte- of klassevelden in het content-schema.
  try {
    const json = z.toJSONSchema(b.content, { unrepresentable: "any" });
    for (const name of propertyNames(json)) {
      if (FORBIDDEN_CONTENT_KEYS.test(name)) fail(at, `content-veld "${name}" hoort niet in de inhoud; uiterlijk hoort in settings en is een token`);
    }
  } catch {
    warn(at, "content-schema kon niet naar JSON Schema worden omgezet; veldnamen niet gecontroleerd");
  }
}

function checkHtml(b: AnyBlock, label: string, html: string) {
  const at = `${b.slug} › ${label}`;
  if (html.includes("blk-error")) return fail(at, "sectie rendert een foutmelding (ongeldige data)");
  if (!html.trim()) return fail(at, "lege HTML");
  if (/\sstyle\s*=/.test(html)) fail(at, "inline style-attribuut gevonden");
  if (/<style[\s>]/i.test(html)) fail(at, "<style>-element gevonden");
  if (/<script(?![^>]*application\/ld\+json)/i.test(html)) fail(at, "<script> gevonden (alleen application/ld+json is toegestaan)");

  for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!/\salt=/.test(img)) fail(at, `<img> zonder alt: ${img.slice(0, 60)}…`);
    if (!/\swidth=/.test(img) || !/\sheight=/.test(img)) warn(at, "<img> zonder width/height geeft layoutverschuiving (CLS)");
  }
  for (const a of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []) {
    if (!/\shref="[^"]+"/.test(a)) fail(at, "<a> zonder href");
    if (!a.replace(/<[^>]+>/g, "").trim()) fail(at, "<a> zonder tekst");
  }

  // Kopniveaus: h1 alleen in de hero, daarna nooit meer dan één niveau dieper dan de vorige.
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  if (levels.includes(1) && !H1_ALLOWED.has(b.slug)) fail(at, "<h1> gevonden; alleen de hero heeft een h1");
  let prev = H1_ALLOWED.has(b.slug) ? 0 : 1;
  for (const l of levels) {
    if (l > prev + 1) fail(at, `kopniveau springt van h${prev} naar h${l}`);
    prev = l;
  }

  // Class-prefix: eigen klassen beginnen met blk-<slug>; gedeelde (Section, knoppen) zijn toegestaan.
  const shared = /^(blk|blk-root|blk-btns?|blk-btn--(primary|secondary)|blk--[a-z-]+|blk__inner(--[a-z]+)?)$/;
  for (const cls of new Set([...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)))) {
    if (!cls || shared.test(cls)) continue;
    if (!cls.startsWith(`blk-${b.slug}`)) fail(at, `class "${cls}" moet met "blk-${b.slug}" beginnen`);
  }
}

function checkFixtures(b: AnyBlock) {
  const at = b.slug;
  const covered = new Set(b.fixtures.map((f) => f.variant));
  for (const v of b.variants) if (!covered.has(v.id)) fail(at, `geen fixture voor variant "${v.id}"`);
  const names = b.fixtures.map((f) => f.name);
  if (new Set(names).size !== names.length) fail(at, "fixture-namen moeten uniek zijn");

  const schema = sectionSchemaFor(b);
  b.fixtures.forEach((f, i) => {
    const label = f.name || `fixture ${i + 1}`;
    const section = { id: `${b.slug}-${i + 1}`, type: b.slug, variant: f.variant, content: f.content, settings: f.settings };
    const result = schema.safeParse(section);
    if (!result.success) {
      const issues = result.error.issues.map((x) => `${x.path.join(".") || "(sectie)"}: ${x.message}`).join("; ");
      return fail(`${b.slug} › ${label}`, `voldoet niet aan het schema — ${issues}`);
    }

    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => errors.push(args.map(String).join(" "));
    let html = "";
    try {
      html = renderToStaticMarkup(createElement(BlockSection, { section }));
    } catch (e) {
      fail(`${b.slug} › ${label}`, `renderen mislukt: ${(e as Error).message}`);
    } finally {
      console.error = original;
    }
    for (const e of errors) fail(`${b.slug} › ${label}`, `React-waarschuwing: ${e.split("\n")[0]}`);
    if (html) checkHtml(b, label, html);
  });
}

// ── 3. bronbestanden: kleuren, inline styles, tokens, selectors ───────────────

const definedLocalVars = new Set<string>();
const files = walk(BLOCKS_DIR).filter((f) => /\.(tsx|css)$/.test(f));
for (const f of files.filter((x) => x.endsWith(".css"))) {
  for (const m of stripCssComments(readFileSync(f, "utf8")).matchAll(/(?<![\w-])(--[a-z0-9-]+)\s*:/g)) definedLocalVars.add(m[1]);
}

function owner(file: string) {
  const dir = relative(BLOCKS_DIR, file).split("/")[0];
  return slugs.includes(dir) ? dir : "gedeeld";
}

for (const file of files) {
  const at = `${owner(file)} › ${rel(file).replace("src/blocks/", "")}`;
  const src = readFileSync(file, "utf8");
  const isCss = file.endsWith(".css");
  const code = isCss ? stripCssComments(src) : src.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  if (/#[0-9a-fA-F]{3,8}\b/.test(code)) fail(at, "kleurcode (#hex) gevonden — gebruik een var(--var-*)-token");
  if (/\b(rgb|rgba|hsl|hsla|hwb|lab|lch|oklch|oklab)\(/i.test(code)) fail(at, "kleurfunctie (rgb/hsl/…) gevonden — gebruik een var(--var-*)-token");
  if (/\bstyle\s*=/.test(code) && !isCss) fail(at, "style-prop gevonden — uiterlijk hoort in CSS met tokens");
  if (/<style[\s>]/i.test(code)) fail(at, "<style>-element gevonden");
  if (/dangerouslySetInnerHTML/.test(code) && !file.endsWith("parts/JsonLd.tsx")) {
    fail(at, "dangerouslySetInnerHTML gevonden — voor JSON-LD gebruik <JsonLd> uit parts/JsonLd.tsx");
  }
  if (!isCss && /["']use client["']/.test(code)) fail(at, '"use client" gevonden — blocks zijn server components');
  if (!isCss && /from\s+["']next\//.test(code)) fail(at, "import uit next/* gevonden — blocks blijven framework-onafhankelijk");

  if (isCss) {
    if (/!important/.test(code)) fail(at, "!important gevonden");
    const withoutVars = code.replace(/var\([^)]*\)/g, "");
    if (new RegExp(`(?:color|background(?:-color)?|border(?:-[a-z]+)?|outline(?:-color)?|fill|stroke)\\s*:[^;{}]*\\b(${NAMED_COLORS})\\b`, "i").test(withoutVars)) {
      fail(at, "kleurnaam (white/black/…) gevonden — gebruik een var(--var-*)-token");
    }
    if (/\d{2,}px|[2-9]px/.test(code)) warn(at, "px-waarde gevonden — gebruik een token of rem");

    for (const m of code.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      const name = m[1];
      if (name.startsWith("--var-")) {
        if (!TOKEN_VARS.includes(name)) fail(at, `onbekend token ${name} (typefout? zie src/blocks/theme.ts)`);
      } else if (name.startsWith("--blk-")) {
        if (!definedLocalVars.has(name)) fail(at, `lokale variabele ${name} wordt gebruikt maar nergens gedefinieerd`);
      } else {
        fail(at, `${name}: alleen --var-* tokens en eigen --blk-*-variabelen zijn toegestaan`);
      }
    }
    for (const m of code.matchAll(/(?<![\w-])(--[a-z0-9-]+)\s*:/g)) {
      if (!m[1].startsWith("--blk-")) fail(at, `eigen variabele ${m[1]} moet met --blk- beginnen`);
    }
    for (const m of code.matchAll(/@media\s*([^{]*)\{/g)) {
      if (!/prefers-/.test(m[1])) fail(at, `@media ${m[1].trim()} — gebruik @container blk (zodat het builder-canvas werkt)`);
    }
    for (const m of code.matchAll(/@container\s*([^({]*)\(/g)) {
      if (m[1].trim() !== "blk") fail(at, `@container "${m[1].trim()}" — gebruik de container "blk"`);
    }

    // Selectors in de styles.css van een block moeten bij dat block horen.
    const dir = owner(file);
    if (dir !== "gedeeld" && file.endsWith("styles.css")) {
      const preludes = code.match(/[^{}]+(?=\{)/g) ?? [];
      for (const prelude of preludes) {
        if (prelude.trim().startsWith("@")) continue;
        for (const c of prelude.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
          const cls = c[1];
          if (cls.startsWith(`blk-${dir}`) || cls.startsWith("blk-btn") || cls.startsWith("blk--")) continue;
          fail(at, `selector .${cls} moet met .blk-${dir} beginnen`);
        }
      }
    }
  }
}

// ── 4. uitvoeren en rapporteren ───────────────────────────────────────────────

for (const b of blocks) {
  checkMeta(b);
  checkFixtures(b);
}

const errors = findings.filter((f) => f.level === "fout");
const warnings = findings.filter((f) => f.level === "waarschuwing");
for (const f of findings) console.log(`${f.level === "fout" ? "✗" : "!"} [${f.block}] ${f.message}`);

console.log("");
for (const b of blocks) {
  const own = errors.filter((f) => f.block === b.slug || f.block.startsWith(`${b.slug} ›`)).length;
  console.log(`${own === 0 ? "✓" : "✗"} ${b.slug.padEnd(14)} ${b.variants.length} varianten · ${b.fixtures.length} fixtures${own ? ` · ${own} fout(en)` : ""}`);
}
console.log(`\n${blocks.length} blocks · ${errors.length} fouten · ${warnings.length} waarschuwingen`);
process.exit(errors.length > 0 ? 1 : 0);
