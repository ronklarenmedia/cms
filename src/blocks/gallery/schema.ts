import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "grid", label: "Raster — gelijke tegels" },
  { id: "bento", label: "Bento — enkele grote tegels" },
  { id: "masonry", label: "Metselwerk — beelden op eigen hoogte" },
] as const;
export type GalleryVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  images: z
    .array(
      z.object({
        image: imageSchema,
        caption: z.string().max(120).optional(),
      }),
    )
    .min(2)
    .max(24),
});
export type GalleryContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["2", "3", "4"]).default("3"),
  // Alleen bij "Raster": de vorm van elke tegel.
  aspect: z.enum(["photo", "square", "video"]).default("photo"),
});
export type GallerySettings = z.output<typeof settings>;

export type GalleryFixture = Fixture<GalleryVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
