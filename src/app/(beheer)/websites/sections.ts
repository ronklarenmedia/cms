// Gedeelde helpers voor secties: gebruikt door de builder (client) én de server actions.
import { sectionSchemaFor, type AnyBlock, type SectionData } from "@/blocks/contract";
import { getBlock } from "@/blocks/registry";
import type { SiteLayout } from "@/db/schema";
import { fieldLabel } from "./labels";
import { emptyLayout, slotBlockSlugs, slots, type Slot } from "./layout-slots";
import type { ZodType, z } from "zod";

export const newSectionId = () => "sec_" + crypto.randomUUID().slice(0, 8);

/** Nieuwe sectie op basis van de fixture van een block (de fixtures zijn geldige, realistische voorbeelddata). */
export function newSection(block: AnyBlock, variant?: string): SectionData {
  const fixture = block.fixtures.find((f) => f.variant === variant) ?? block.fixtures[0];
  return {
    id: newSectionId(),
    type: block.slug,
    variant: fixture.variant,
    content: structuredClone(fixture.content),
    settings: structuredClone(fixture.settings ?? {}),
  };
}

export type StarterId = "starter" | "leeg";
export const starters: { id: StarterId; label: string; description: string }[] = [
  { id: "starter", label: "Starter", description: "Hero, USP-grid en een afsluitende call-to-action om mee te beginnen." },
  { id: "leeg", label: "Leeg", description: "Een lege homepagina; voeg zelf secties toe." },
];

/** Startinhoud van de homepagina van een nieuwe site. */
export function starterSections(starter: StarterId, siteName: string): SectionData[] {
  if (starter === "leeg") return [];
  const out: SectionData[] = [];
  for (const slug of ["hero", "usp-grid", "cta-banner"]) {
    const block = getBlock(slug);
    if (block) out.push(newSection(block));
  }
  const hero = out.find((s) => s.type === "hero");
  if (hero) hero.content = { ...(hero.content as object), heading: siteName };
  return out;
}

/** Header en footer van een nieuwe site: de eerste voorbeelden van de blocks, met de naam van de site ingevuld. */
export function starterLayout(siteName: string): SiteLayout {
  const layout = emptyLayout();
  const header = getBlock("site-header");
  const footer = getBlock("site-footer");
  if (header) {
    const s = newSection(header);
    // Geen voorbeeldlogo en geen verzonnen pagina's: alleen de naam en een link naar de homepagina.
    s.content = { brand: siteName, links: [{ label: "Home", href: "/", children: [] }] };
    layout.header.push(s);
  }
  if (footer) {
    const s = newSection(footer);
    s.content = { brand: siteName, copyright: `© ${new Date().getFullYear()} ${siteName}` };
    layout.footer.push(s);
  }
  return layout;
}

// ── Validatie ─────────────────────────────────────────────────────────────────

const schemaCache = new WeakMap<AnyBlock, ZodType>();
const schemaOf = (block: AnyBlock) => {
  let s = schemaCache.get(block);
  if (!s) schemaCache.set(block, (s = sectionSchemaFor(block)));
  return s;
};

export type SectionIssue = { path: string; message: string };

/** Nederlandse foutmelding bij een Zod-issue; de standaardteksten van Zod zijn Engels. */
function dutch(issue: z.core.$ZodIssue): string {
  switch (issue.code) {
    case "invalid_type":
      return "Verplicht veld";
    case "too_small":
      return issue.origin === "array" ? `Minimaal ${issue.minimum} item(s)` : "Verplicht veld";
    case "too_big":
      return issue.origin === "array" ? `Maximaal ${issue.maximum} item(s)` : `Te lang (maximaal ${issue.maximum} tekens)`;
    case "invalid_value":
      return "Kies een geldige waarde";
    case "invalid_format":
      return "Ongeldige notatie";
    default:
      return issue.message;
  }
}

/** Validatieproblemen van één sectie (leeg = geldig). Het pad is dotted, bijv. `content.buttons.0.label`. */
export function sectionIssues(section: SectionData): SectionIssue[] {
  const block = getBlock(section.type);
  if (!block) return [{ path: "type", message: `Onbekend bloktype "${section.type}"` }];
  const parsed = schemaOf(block).safeParse(section);
  if (parsed.success) return [];
  return parsed.error.issues.map((i) => ({ path: i.path.join("."), message: dutch(i) }));
}

/** Leesbare regel bij een issue: `Hero — Kop: Verplicht veld` (het laatste niet-numerieke padsegment is het veld). */
export function describeIssue(section: SectionData, issue: SectionIssue): string {
  const label = getBlock(section.type)?.label ?? section.type;
  const field = issue.path.split(".").reverse().find((seg) => !/^\d+$/.test(seg));
  return `${label} — ${field ? fieldLabel(field) : "sectie"}: ${issue.message}`;
}

/** Eén leesbare regel per ongeldige sectie, voor de opslagstatus. */
export function sectionsProblems(sections: SectionData[]): string[] {
  return sections.flatMap((s) => {
    const issues = sectionIssues(s);
    return issues.length === 0 ? [] : [describeIssue(s, issues[0])];
  });
}

/** Zet ongevalideerde invoer om naar de genormaliseerde (met defaults aangevulde) secties, of geeft fouten terug. */
/** Waar de secties komen te staan: een gewone pagina (geen header/footer-blocks) of een slot (alleen zijn eigen blocks). */
export type Placement = { kind: "page" } | { kind: "slot"; slot: Slot };

export function parseSections(
  input: unknown,
  placement: Placement = { kind: "page" },
): { ok: true; sections: SectionData[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "Ongeldige paginadata." };
  const seen = new Set<string>();
  const sections: SectionData[] = [];
  for (const raw of input) {
    const type = (raw as { type?: unknown } | null)?.type;
    const block = typeof type === "string" ? getBlock(type) : undefined;
    if (!block) return { ok: false, error: `Onbekend bloktype "${String(type)}".` };
    const allowedHere =
      placement.kind === "page" ? !slotBlockSlugs.has(block.slug) : slots[placement.slot].allowed.includes(block.slug);
    if (!allowedHere) {
      return { ok: false, error: `${block.label} mag ${placement.kind === "page" ? "niet op een gewone pagina" : `niet in de ${slots[placement.slot].label.toLowerCase()}`} staan.` };
    }
    const parsed = schemaOf(block).safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: describeIssue(raw as SectionData, { path: first.path.join("."), message: dutch(first) }) };
    }
    const data = parsed.data as SectionData;
    if (seen.has(data.id)) return { ok: false, error: `Dubbel sectie-id "${data.id}".` };
    seen.add(data.id);
    sections.push({ id: data.id, type: data.type, variant: data.variant, content: data.content, settings: data.settings });
  }
  return { ok: true, sections };
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
