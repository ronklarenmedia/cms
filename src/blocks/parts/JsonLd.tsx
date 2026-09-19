/**
 * Gestructureerde data (schema.org) voor zoekmachines en AI-assistenten, bijv. FAQPage of Review.
 * Enige plek in de blocks waar dangerouslySetInnerHTML is toegestaan: `<` wordt ontsnapt zodat
 * inhoud nooit het script-element kan afsluiten.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
