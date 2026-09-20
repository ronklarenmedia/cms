import type { BlockProps } from "../contract";
import { JsonLd } from "../parts/JsonLd";
import type { BreadcrumbsContent, BreadcrumbsSettings, BreadcrumbsVariant } from "./schema";

export function Breadcrumbs({ variant, content }: BlockProps<BreadcrumbsVariant, BreadcrumbsContent, BreadcrumbsSettings>) {
  const { items } = content;
  const last = items.length - 1;

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      // Het laatste onderdeel is de huidige pagina; zoekmachines verwachten daar geen adres.
      ...(item.href && idx < last ? { item: item.href } : {}),
    })),
  };

  return (
    <nav className={`blk-breadcrumbs blk-breadcrumbs--${variant}`} aria-label="Kruimelpad">
      <JsonLd data={jsonLdData} />
      <ol className="blk-breadcrumbs__list">
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="blk-breadcrumbs__item">
            {idx < last && item.href ? (
              <a className="blk-breadcrumbs__link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className="blk-breadcrumbs__current" aria-current={idx === last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
