import Link from "next/link";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import type { AnyBlock, Status } from "@/blocks/contract";
import { blocks } from "@/blocks/registry";
import { themes, themeToCssVars, type ThemeId } from "@/blocks/theme";

// Breedtes simuleren de builder-apparaten; blocks reageren op de containerbreedte (@container blk).
const widths = {
  desktop: { label: "Desktop", width: "100%", icon: "monitor" },
  tablet: { label: "Tablet", width: "760px", icon: "device-tablet" },
  mobiel: { label: "Mobiel", width: "390px", icon: "device-mobile" },
} as const;
type WidthId = keyof typeof widths;

const statusTag: Record<Status, string> = {
  "kit-ready": "tag tag-neutral",
  beta: "tag tag-accent",
  verouderd: "tag tag-outline",
};
const statusLabel: Record<Status, string> = { "kit-ready": "Kit-ready", beta: "Beta", verouderd: "Verouderd" };

const isTheme = (v: string | undefined): v is ThemeId => !!v && v in themes;
const isWidth = (v: string | undefined): v is WidthId => !!v && v in widths;

function Controls({ thema, breedte }: { thema: ThemeId; breedte: WidthId }) {
  const link = (t: ThemeId, b: WidthId) => `/componenten/showcase?thema=${t}&breedte=${b}`;
  const cls = (on: boolean) => `btn ${on ? "btn-primary" : "btn-secondary"}`;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-muted text-[12px]">Thema</span>
        {(Object.keys(themes) as ThemeId[]).map((t) => (
          <Link key={t} href={link(t, breedte)} className={cls(t === thema)}>
            {themes[t].label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted text-[12px]">Breedte</span>
        {(Object.keys(widths) as WidthId[]).map((b) => (
          <Link key={b} href={link(thema, b)} className={cls(b === breedte)} title={widths[b].label}>
            <i className={`ph ph-${widths[b].icon}`} />
            {widths[b].label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlockShowcase({ block, thema, breedte }: { block: AnyBlock; thema: ThemeId; breedte: WidthId }) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <i className={`ph ph-${block.icon} text-[18px] text-accent`} />
          <h4 className="!mb-0">{block.label}</h4>
          <span className={statusTag[block.status]}>{statusLabel[block.status]}</span>
          <span className="text-muted text-[12px]">
            {block.category} · {block.variants.length} varianten · <code>{block.slug}</code>
          </span>
        </div>
        <p className="text-muted !mb-0 text-[13px]">{block.description}</p>
      </header>

      {block.fixtures.map((fixture, i) => (
        <figure key={fixture.name} className="m-0 flex flex-col gap-2">
          <figcaption className="text-muted text-[12px]">
            <code>{fixture.variant}</code> — {fixture.name}
          </figcaption>
          <div
            className="elev-sm overflow-hidden rounded-lg"
            style={{
              ...themeToCssVars(themes[thema].theme),
              width: widths[breedte].width,
              maxWidth: "100%",
              background: "var(--var-color-white)",
            }}
          >
            <BlockSection
              section={{
                id: `${block.slug}-${i + 1}`,
                type: block.slug,
                variant: fixture.variant,
                content: fixture.content,
                settings: fixture.settings,
              }}
            />
          </div>
        </figure>
      ))}
    </section>
  );
}

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ thema?: string; breedte?: string }>;
}) {
  const sp = await searchParams;
  const thema = isTheme(sp.thema) ? sp.thema : "corporate";
  const breedte = isWidth(sp.breedte) ? sp.breedte : "desktop";
  const variants = blocks.reduce((n, b) => n + b.variants.length, 0);
  const fixtures = blocks.reduce((n, b) => n + b.fixtures.length, 0);

  return (
    <div className="flex flex-col gap-[var(--space-8)]">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="!mb-1">Block-showcase</h2>
          <div className="text-muted text-[12.5px]">
            {blocks.length} blocks · {variants} varianten · {fixtures} voorbeelden — dezelfde data als de checker
            (<code>npm run check:blocks</code>) valideert
          </div>
        </div>
        <Controls thema={thema} breedte={breedte} />
      </div>
      {blocks.map((block) => (
        <BlockShowcase key={block.slug} block={block} thema={thema} breedte={breedte} />
      ))}
    </div>
  );
}
