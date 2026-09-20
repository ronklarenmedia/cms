"use server";

import { eq, max, sql } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SectionData } from "@/blocks/contract";
import { db } from "@/db";
import { customers, pages, sites } from "@/db/schema";
import { deleteMediaFiles } from "@/lib/media";
import { NOT_LOGGED_IN, requireAdmin, staffUser } from "@/lib/session";
import { isSlot, type Slot } from "./layout-slots";
import { parseSections, slugify, starterLayout, starterSections, themeOptions, type StarterId } from "./sections";

export type ActionState = { error?: string } | undefined;
export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const isUniqueViolation = (e: unknown) =>
  typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "23505";

export async function createSite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await staffUser())) return { error: NOT_LOGGED_IN };
  const name = String(formData.get("name") ?? "").trim();
  const customerId = String(formData.get("customerId") ?? "");
  const themeId = String(formData.get("theme") ?? "");
  const starter: StarterId = formData.get("starter") === "leeg" ? "leeg" : "starter";

  if (!name) return { error: "Geef de website een naam." };
  if (!customerId) return { error: "Kies een klant." };
  const [customer] = await db.select({ id: customers.id }).from(customers).where(eq(customers.id, customerId));
  if (!customer) return { error: "Deze klant bestaat niet (meer)." };

  const theme = themeOptions.find((t) => t.id === themeId)?.theme ?? {};
  const base = slugify(name) || "website";

  // Slug moet uniek zijn: bij een botsing proberen we base-2, base-3, …
  for (let attempt = 1; attempt <= 20; attempt++) {
    const slug = attempt === 1 ? base : `${base}-${attempt}`;
    try {
      const site = await db.transaction(async (tx) => {
        const [created] = await tx.insert(sites).values({ customerId, name, slug, theme, layout: starterLayout(name) }).returning({ id: sites.id });
        await tx.insert(pages).values({
          siteId: created.id,
          slug: "",
          title: "Home",
          position: 0,
          content: starterSections(starter, name),
        });
        return created;
      });
      revalidatePath("/websites");
      redirect(`/websites/${site.id}`);
    } catch (e) {
      if (isUniqueViolation(e)) continue;
      throw e; // ook de redirect() van Next werkt via een throw en moet doorlopen
    }
  }
  return { error: "Kon geen unieke naam voor de website vinden. Probeer een andere naam." };
}

/** Slaat de secties van één pagina op. Ongeldige secties worden geweigerd, zodat de opslag altijd rendert. */
export async function savePage(pageId: string, sections: SectionData[]): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  const parsed = parseSections(sections);
  if (!parsed.ok) return parsed;
  const updated = await db
    .update(pages)
    .set({ content: parsed.sections, updatedAt: new Date() })
    .where(eq(pages.id, pageId))
    .returning({ siteId: pages.siteId });
  if (updated.length === 0) return { ok: false, error: "Deze pagina bestaat niet meer." };
  await db.update(sites).set({ updatedAt: new Date() }).where(eq(sites.id, updated[0].siteId));
  return { ok: true };
}

export type PageDTO = {
  id: string;
  slug: string;
  title: string;
  sections: SectionData[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  noindex: boolean;
};

/** De velden die een pagina-instellingenformulier kan wijzigen. */
export type PageSettings = Pick<PageDTO, "slug" | "title" | "seoTitle" | "seoDescription" | "ogImage" | "noindex">;

export async function addPage(siteId: string, title: string): Promise<Result<{ page: PageDTO }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  title = title.trim();
  if (!title) return { ok: false, error: "Geef de pagina een titel." };
  const base = slugify(title) || "pagina";

  const [{ last }] = await db.select({ last: max(pages.position) }).from(pages).where(eq(pages.siteId, siteId));
  for (let attempt = 1; attempt <= 20; attempt++) {
    const slug = attempt === 1 ? base : `${base}-${attempt}`;
    try {
      const [row] = await db
        .insert(pages)
        .values({ siteId, slug, title, position: (last ?? 0) + 1, content: [] })
        .returning();
      return {
        ok: true,
        page: {
          id: row.id,
          slug: row.slug,
          title: row.title,
          sections: [],
          seoTitle: null,
          seoDescription: null,
          ogImage: null,
          noindex: false,
        },
      };
    } catch (e) {
      if (isUniqueViolation(e)) continue;
      throw e;
    }
  }
  return { ok: false, error: "Kon geen unieke paginanaam vinden." };
}

/** Slaat de secties van de header of footer op. Alleen blocks die voor die slot bedoeld zijn worden geaccepteerd. */
export async function saveLayout(siteId: string, slot: Slot, sections: SectionData[]): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isSlot(slot)) return { ok: false, error: "Onbekende plek." };
  const parsed = parseSections(sections, { kind: "slot", slot });
  if (!parsed.ok) return parsed;
  // jsonb_set vervangt alleen deze slot, zodat het opslaan van de header en de footer elkaar niet overschrijven.
  const updated = await db
    .update(sites)
    .set({
      layout: sql`jsonb_set(${sites.layout}, ${`{${slot}}`}::text[], ${JSON.stringify(parsed.sections)}::jsonb)`,
      updatedAt: new Date(),
    })
    .where(eq(sites.id, siteId))
    .returning({ id: sites.id });
  if (updated.length === 0) return { ok: false, error: "Deze website bestaat niet meer." };
  return { ok: true };
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const pageSettingsSchema = z.object({
  title: z.string().trim().min(1, "Geef de pagina een titel.").max(255),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "De URL mag alleen kleine letters, cijfers en streepjes bevatten."),
  seoTitle: optionalText(255),
  seoDescription: optionalText(400),
  ogImage: optionalText(500).refine((v) => v === null || v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "De afbeelding moet een link zijn (https://…) of een pad dat met / begint.",
  }),
  noindex: z.boolean(),
});

/** Titel, URL en SEO-velden van één pagina. De URL van de homepagina staat vast. */
export async function updatePageSettings(pageId: string, input: PageSettings): Promise<Result<{ settings: PageSettings }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  const [page] = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.id, pageId));
  if (!page) return { ok: false, error: "Deze pagina bestaat niet meer." };
  const isHome = page.slug === "";

  // De homepagina houdt zijn lege URL; voor de validatie geven we een geldige plaatsvervanger mee.
  const parsed = pageSettingsSchema.safeParse({ ...input, slug: isHome ? "home" : input.slug });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;
  const slug = isHome ? "" : data.slug;

  try {
    await db
      .update(pages)
      .set({
        title: data.title,
        slug,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImage: data.ogImage,
        noindex: data.noindex,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, pageId));
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, error: "Deze URL wordt al door een andere pagina gebruikt." };
    throw e;
  }
  return {
    ok: true,
    settings: {
      slug,
      title: data.title,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImage: data.ogImage,
      noindex: data.noindex,
    },
  };
}

export async function renamePage(pageId: string, title: string): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  title = title.trim();
  if (!title) return { ok: false, error: "Geef de pagina een titel." };
  await db.update(pages).set({ title, updatedAt: new Date() }).where(eq(pages.id, pageId));
  return { ok: true };
}

export async function deletePage(pageId: string): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  const [page] = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.id, pageId));
  if (!page) return { ok: true };
  if (page.slug === "") return { ok: false, error: "De homepagina kan niet worden verwijderd." };
  await db.delete(pages).where(eq(pages.id, pageId));
  return { ok: true };
}

export async function deleteSite(siteId: string) {
  await requireAdmin();
  await db.delete(sites).where(eq(sites.id, siteId));
  // De rijen in `media` verdwijnen vanzelf mee; de bestanden in R2 ruimen we hier op (mislukt dat, dan blijven ze verweesd staan).
  await deleteMediaFiles(siteId).catch((e) => console.error("Bestanden van verwijderde website opruimen mislukt:", e instanceof Error ? e.message : e));
  revalidatePath("/websites");
  redirect("/websites");
}
