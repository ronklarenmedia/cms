import type { SiteTheme } from "@/blocks/theme";
import { fullTheme } from "@/lib/theme-tokens";

// Miniatuur van een kit: de lettertypes, kleuren en hoekafronding van het thema. Puur weergave; werkt in server- en clientcomponenten.

const firstFamily = (stack: string | number) => String(stack).split(",")[0].replace(/["']/g, "").trim();

/** De eerste naam uit de lettertypestack, voor in een bijschrift ("Georgia"). */
export const fontName = (theme: SiteTheme) => firstFamily(fullTheme(theme).fontFamilyPrimary);

export function KitSwatches({ theme, size = "md" }: { theme: SiteTheme; size?: "sm" | "md" }) {
  const t = fullTheme(theme);
  const colors = [t.colorPrimary, t.colorSecondary, t.colorAccent, t.colorBgPrimaryMedium, t.colorText];
  return (
    <span className="flex gap-1" aria-hidden="true">
      {colors.map((c, i) => (
        <span key={i} className={`${size === "sm" ? "size-4" : "size-5"} rounded-sm shadow-[var(--shadow-sm)]`} style={{ background: String(c) }} />
      ))}
    </span>
  );
}

export function KitCard({ theme }: { theme: SiteTheme }) {
  const t = fullTheme(theme);
  return (
    <div className="flex aspect-[16/10] flex-col overflow-hidden shadow-[var(--shadow-sm)]" style={{ background: String(t.colorOffWhite), borderRadius: "var(--radius-md)" }} aria-hidden="true">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3.5 py-3">
        <div style={{ fontFamily: String(t.fontFamilyPrimary), color: String(t.colorText), fontWeight: 500, fontSize: 22, lineHeight: 1, letterSpacing: "-0.02em" }}>Aa</div>
        <div style={{ height: 4, width: "70%", borderRadius: 2, background: String(t.colorPrimary) }} />
        <div style={{ height: 3, width: "52%", borderRadius: 2, background: String(t.colorBgPrimaryMedium) }} />
        <div style={{ height: 3, width: "38%", borderRadius: 2, background: String(t.colorBgPrimaryMedium) }} />
      </div>
      <div className="flex h-4 flex-none">
        {[t.colorPrimary, t.colorSecondary, t.colorAccent, t.colorBgPrimaryLight, t.colorText].map((c, i) => (
          <span key={i} className="flex-1" style={{ background: String(c) }} />
        ))}
      </div>
    </div>
  );
}
