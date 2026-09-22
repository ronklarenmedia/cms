import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "table", label: "Tabel" },
  { id: "compact", label: "Tabel, compact" },
] as const;
export type ComparisonVariant = (typeof variants)[number]["id"];

export const content = z
  .object({
    eyebrow: z.string().max(60).optional(),
    heading: z.string().max(120).optional(),
    intro: z.string().max(300).optional(),
    columns: z
      .array(
        z.object({
          name: z.string().min(1).max(60),
          highlighted: z.boolean().default(false),
        }),
      )
      .min(2)
      .max(5),
    rows: z
      .array(
        z.object({
          label: z.string().min(1).max(100),
          // Eén waarde per kolom, in dezelfde volgorde; vrije tekst (bijv. "Ja", "—", "10 GB").
          values: z.array(z.string().min(1).max(40)).min(2).max(5),
        }),
      )
      .min(1)
      .max(20),
  })
  .refine((data) => data.rows.every((r) => r.values.length === data.columns.length), {
    message: "elke rij moet evenveel waarden hebben als er kolommen zijn",
    path: ["rows"],
  });
export type ComparisonContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type ComparisonSettings = z.output<typeof settings>;

export type ComparisonFixture = Fixture<ComparisonVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
