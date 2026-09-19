import type { ZodType } from "zod";
import { sectionSchemaFor, type AnyBlock, type SectionData, type SectionSettings } from "./contract";
import { getBlock } from "./registry";
import { Section } from "./Section";

const schemaCache = new WeakMap<AnyBlock, ZodType>();
const schemaOf = (block: AnyBlock) => {
  let schema = schemaCache.get(block);
  if (!schema) schemaCache.set(block, (schema = sectionSchemaFor(block)));
  return schema;
};

function BlockError({ message }: { message: string }) {
  // In productie liever een sectie missen dan een kapotte pagina tonen.
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="blk-error" role="alert">
      {message}
    </div>
  );
}

/** Rendert één opgeslagen sectie: valideert tegen het schema van zijn block en wikkelt hem in <Section>. */
export function BlockSection({ section }: { section: SectionData }) {
  const block = getBlock(section.type);
  if (!block) return <BlockError message={`Onbekend bloktype "${section.type}"`} />;

  const parsed = schemaOf(block).safeParse(section);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(sectie)"}: ${i.message}`);
    return <BlockError message={`${block.slug} (${section.id}) is ongeldig:\n${issues.join("\n")}`} />;
  }

  const { variant, content, settings } = parsed.data as {
    variant: string;
    content: unknown;
    settings: SectionSettings;
  };
  const Component = block.Component;
  return (
    <Section block={block.slug} variant={variant} settings={settings}>
      <Component variant={variant} content={content} settings={settings} />
    </Section>
  );
}

/** Rendert de secties van een pagina (`pages.content`) in volgorde. */
export function BlockRenderer({ sections }: { sections: SectionData[] }) {
  return (
    <>
      {sections.map((section) => (
        <BlockSection key={section.id} section={section} />
      ))}
    </>
  );
}
