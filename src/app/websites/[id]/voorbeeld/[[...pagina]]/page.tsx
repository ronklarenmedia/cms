import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/blocks/blocks.css";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { themeToCssVars } from "@/blocks/theme";
import { db } from "@/db";
import { pages, sites } from "@/db/schema";
import { isUuid } from "../../../ids";
import { PreviewLinks } from "../PreviewLinks";

// Voorbeeld van een pagina zoals de bezoeker hem ziet: zonder platform-menu, met het thema van de site.
export default async function VoorbeeldPage({ params }: { params: Promise<{ id: string; pagina?: string[] }> }) {
  const { id, pagina } = await params;
  if (!isUuid(id)) notFound();
  const slug = pagina?.[0] ?? "";

  const [site] = await db.select().from(sites).where(eq(sites.id, id));
  if (!site) notFound();
  const all = await db.select().from(pages).where(eq(pages.siteId, id)).orderBy(asc(pages.position), asc(pages.createdAt));
  const page = all.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <div className="min-h-screen" style={{ ...themeToCssVars(site.theme), background: "var(--var-color-white)" }}>
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-3 bg-neutral-100 px-4 py-2 text-[12px] text-neutral-900">
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
      <PreviewLinks siteId={id}>
        <BlockRenderer sections={page.content} />
      </PreviewLinks>
    </div>
  );
}
