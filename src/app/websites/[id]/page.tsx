import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, pages, sites } from "@/db/schema";
import { isUuid } from "../ids";
import { SiteBuilder } from "../SiteBuilder";
import { requireStaff } from "@/lib/session";

export default async function WebsiteBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const [row] = await db
    .select({ site: sites, customerName: customers.name })
    .from(sites)
    .innerJoin(customers, eq(customers.id, sites.customerId))
    .where(eq(sites.id, id));
  if (!row) notFound();

  const pageRows = await db.select().from(pages).where(eq(pages.siteId, id)).orderBy(asc(pages.position), asc(pages.createdAt));

  return (
    <SiteBuilder
      key={id}
      canDelete={user.role === "platform-admin"}
      site={{
        id: row.site.id,
        name: row.site.name,
        slug: row.site.slug,
        status: row.site.status,
        theme: row.site.theme,
        customerName: row.customerName,
      }}
      initialPages={pageRows.map((p) => ({ id: p.id, slug: p.slug, title: p.title, sections: p.content }))}
    />
  );
}
