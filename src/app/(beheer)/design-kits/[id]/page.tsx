import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers, designKits, hostedFonts, sites } from "@/db/schema";
import { requireStaff } from "@/lib/session";
import { isUuid } from "../../websites/ids";
import { KitEditor } from "./KitEditor";

export default async function KitEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const [row] = await db
    .select({ kit: designKits, customerName: customers.name })
    .from(designKits)
    .leftJoin(customers, eq(customers.id, designKits.customerId))
    .where(eq(designKits.id, id));
  if (!row) notFound();

  const users = await db.select({ id: sites.id, name: sites.name }).from(sites).where(eq(sites.designKitId, id)).orderBy(asc(sites.name));
  const fonts = await db.select().from(hostedFonts);

  return (
    <KitEditor
      key={id}
      kit={{ id: row.kit.id, name: row.kit.name, theme: row.kit.theme, customerName: row.customerName }}
      sites={users}
      canDelete={user.role === "platform-admin"}
      initialHostedFonts={fonts}
    />
  );
}
