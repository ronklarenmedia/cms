import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import "@/blocks/blocks.css";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { themeToCssVars } from "@/blocks/theme";
import { db } from "@/db";
import { pages, sites } from "@/db/schema";
import { effectiveSiteTheme } from "@/lib/kits";
import { requireStaff } from "@/lib/session";
import { isUuid } from "../../../ids";
import { pageMetadata } from "../../../seo";
import { SiteFrame } from "../../../SiteFrame";
import { PreviewLinks } from "../PreviewLinks";

type Params = Promise<{ id: string; pagina?: string[] }>;

// generateMetadata en de pagina delen één opzoeking, en beide controleren de sessie zelf:
// ook de paginatitel van een concept-site mag niet uitlekken.
const load = cache(async (id: string, slug: string) => {
  await requireStaff();
  if (!isUuid(id)) return null;
  const [site] = await db.select().from(sites).where(eq(sites.id, id));
  if (!site) return null;
  const all = await db.select().from(pages).where(eq(pages.siteId, id)).orderBy(asc(pages.position), asc(pages.createdAt));
  const page = all.find((p) => p.slug === slug);
  return page ? { site, all, page, theme: await effectiveSiteTheme(site) } : null;
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id, pagina } = await params;
  const data = await load(id, pagina?.[0] ?? "");
  return data ? pageMetadata(data.site.name, data.page, { preview: true }) : {};
}

// Voorbeeld van een pagina zoals de bezoeker hem ziet: zonder platform-menu, met het thema van de site.
export default async function VoorbeeldPage({ params }: { params: Params }) {
  const { id, pagina } = await params;
  const data = await load(id, pagina?.[0] ?? "");
  if (!data) notFound();
  const { site, all, page, theme } = data;

  return (
    <div className="min-h-screen" style={{ ...themeToCssVars(theme), background: "var(--var-color-white)" }}>
      <div className="sticky top-0 z-[200] flex flex-wrap items-center gap-3 bg-neutral-100 px-4 py-2 text-[12px] text-neutral-900">
        <span className="tag tag-accent">Voorbeeld</span>
        <span className="font-medium">{site.name}</span>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Pagina's">
          {all.map((p) => (
            <Link
              key={p.id}
              href={`/websites/${id}/voorbeeld/${p.slug}`}
              className={`rounded-sm px-2 py-0.5 !text-neutral-900 ${p.id === page.id ? "bg-white/15" : "opacity-70 hover:opacity-100"}`}
            >
              {p.title}
            </Link>
          ))}
        </nav>
        <Link href={`/websites/${id}`} className="ml-auto !text-neutral-900 underline">
          Terug naar de editor
        </Link>
      </div>
      {/* isolate: de z-indexen van de site (uitklapmenu's) blijven binnen de site en komen niet boven de voorbeeldbalk. */}
      <div className="isolate">
        <PreviewLinks siteId={id}>
          <SiteFrame
            header={site.layout.header.length > 0 ? <BlockRenderer sections={site.layout.header} /> : null}
            footer={site.layout.footer.length > 0 ? <BlockRenderer sections={site.layout.footer} /> : null}
          >
            <BlockRenderer sections={page.content} />
          </SiteFrame>
        </PreviewLinks>
      </div>
    </div>
  );
}
