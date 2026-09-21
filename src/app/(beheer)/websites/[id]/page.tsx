import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, designKits, pages, sites } from "@/db/schema";
import { isUuid } from "../ids";
import { SiteBuilder } from "../SiteBuilder";
import { effectiveSiteTheme } from "@/lib/kits";
import { requireStaff } from "@/lib/session";
import { getPublishInfo } from "../publishing";

export default async function WebsiteBuilderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ pagina?: string }> }) {
  const user = await requireStaff();
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const [row] = await db
    .select({ site: sites, customerName: customers.name })
    .from(sites)
    .innerJoin(customers, eq(customers.id, sites.customerId))
    .where(eq(sites.id, id));
  if (!row) notFound();

  const [theme, kit] = await Promise.all([
    effectiveSiteTheme(row.site),
    row.site.designKitId
      ? db.select({ id: designKits.id, name: designKits.name }).from(designKits).where(eq(designKits.id, row.site.designKitId)).then((r) => r[0] ?? null)
      : Promise.resolve(null),
  ]);
  const startSlug = (await searchParams).pagina; // bijv. vanuit de zoekbalk; een lege waarde is de homepagina
  const initialPublish = await getPublishInfo(id);
  const pageRows = await db.select().from(pages).where(eq(pages.siteId, id)).orderBy(asc(pages.position), asc(pages.createdAt));

  return (
    <SiteBuilder
      key={id}
      canDelete={user.role === "platform-admin"}
      initialPublish={initialPublish}
      initialPageId={startSlug === undefined ? undefined : pageRows.find((p) => p.slug === startSlug)?.id}
      site={{
        id: row.site.id,
        name: row.site.name,
        slug: row.site.slug,
        theme,
        kit,
        customerId: row.site.customerId,
        favicon: row.site.faviconUrl,
        layout: row.site.layout,
        customerName: row.customerName,
      }}
      initialPages={pageRows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        sections: p.content,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        ogImage: p.ogImage,
        noindex: p.noindex,
      }))}
    />
  );
}
