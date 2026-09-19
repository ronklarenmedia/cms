"use server";

import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SectionData } from "@/blocks/contract";
import { db } from "@/db";
import { customers, pages, sites } from "@/db/schema";
import { parseSections, slugify, starterSections, themeOptions, type StarterId } from "./sections";

export type ActionState = { error?: string } | undefined;
export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const isUniqueViolation = (e: unknown) =>
  typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "23505";

export async function createSite(_prev: ActionState, formData: FormData): Promise<ActionState> {
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
        const [created] = await tx.insert(sites).values({ customerId, name, slug, theme }).returning({ id: sites.id });
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

export type PageDTO = { id: string; slug: string; title: string; sections: SectionData[] };

export async function addPage(siteId: string, title: string): Promise<Result<{ page: PageDTO }>> {
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
      return { ok: true, page: { id: row.id, slug: row.slug, title: row.title, sections: [] } };
    } catch (e) {
      if (isUniqueViolation(e)) continue;
      throw e;
    }
  }
  return { ok: false, error: "Kon geen unieke paginanaam vinden." };
}

export async function renamePage(pageId: string, title: string): Promise<Result> {
  title = title.trim();
  if (!title) return { ok: false, error: "Geef de pagina een titel." };
  await db.update(pages).set({ title, updatedAt: new Date() }).where(eq(pages.id, pageId));
  return { ok: true };
}

export async function deletePage(pageId: string): Promise<Result> {
  const [page] = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.id, pageId));
  if (!page) return { ok: true };
  if (page.slug === "") return { ok: false, error: "De homepagina kan niet worden verwijderd." };
  await db.delete(pages).where(eq(pages.id, pageId));
  return { ok: true };
}

export async function setSiteStatus(siteId: string, status: "draft" | "live"): Promise<Result> {
  const updated = await db
    .update(sites)
    .set({ status, publishedAt: status === "live" ? new Date() : null, updatedAt: new Date() })
    .where(eq(sites.id, siteId))
    .returning({ id: sites.id });
  if (updated.length === 0) return { ok: false, error: "Deze website bestaat niet meer." };
  revalidatePath("/websites");
  return { ok: true };
}

export async function deleteSite(siteId: string) {
  await db.delete(sites).where(eq(sites.id, siteId));
  revalidatePath("/websites");
  redirect("/websites");
}
