import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { themeToCssVars } from "@/blocks/theme";
import { findLiveSite, originOf, pagePath } from "@/lib/public-site";
import { ThemeFonts } from "@/lib/theme-fonts";
import { pageMetadata } from "@/app/(beheer)/websites/seo";
import { SiteFrame } from "@/app/(beheer)/websites/SiteFrame";

type Params = Promise<{ host: string; pagina?: string[] }>;

// Elke pagina wordt bij het eerste bezoek opgebouwd en daarna gecachet (ISR); publiceren maakt de cache van de site ongeldig
// (revalidatePath in src/app/(beheer)/websites/publish.ts). Er wordt hier bewust geen sessie of cookie gelezen: dat zou de pagina dynamisch maken.
export const dynamicParams = true;
// Vangnet: mocht het legen van de cache ooit niet aankomen, dan is een pagina hooguit 10 minuten oud.
export const revalidate = 600;
export async function generateStaticParams() {
  return [];
}

async function load({ host: rawHost, pagina }: Awaited<Params>) {
  if (pagina && pagina.length > 1) return null; // paginaslugs bevatten geen slashes
  const host = decodeURIComponent(rawHost);
  const site = await findLiveSite(host);
  const page = site?.snapshot.pages.find((p) => p.slug === (pagina?.[0] ?? ""));
  return site && page ? { site, page } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await load(await params);
  if (!data) return {};
  const { site, page } = data;
  return {
    ...pageMetadata(site.snapshot.name, page, { preview: site.kind === "preview" }),
    metadataBase: new URL(originOf(site.host)),
    alternates: { canonical: pagePath(page.slug) },
  };
}

export default async function PublicPage({ params }: { params: Params }) {
  const data = await load(await params);
  if (!data) notFound();
  const { site, page } = data;
  // Eén adres per site: wie via een ander adres binnenkomt (www of kaal, het voorbeeldadres), gaat permanent naar het primaire domein.
  if (site.primaryHost && site.host !== site.primaryHost) permanentRedirect(`${originOf(site.primaryHost)}${pagePath(page.slug)}`);
  const { theme, layout } = site.snapshot;

  return (
    <div style={{ ...themeToCssVars(theme), background: "var(--var-color-white)", minHeight: "100vh" }}>
      <ThemeFonts theme={theme} />
      <SiteFrame
        header={layout.header.length > 0 ? <BlockRenderer sections={layout.header} /> : null}
        footer={layout.footer.length > 0 ? <BlockRenderer sections={layout.footer} /> : null}
      >
        <BlockRenderer sections={page.sections} />
      </SiteFrame>
    </div>
  );
}
