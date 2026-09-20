import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "wide", label: "Breed — kop boven de video" },
  { id: "split", label: "Split — tekst naast de video" },
] as const;
export type VideoVariant = (typeof variants)[number]["id"];

/** Wat een video-adres oplevert. Alleen YouTube, Vimeo en losse bestanden; het adres zelf komt nooit rechtstreeks in de pagina. */
export type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; src: string; type: string };

const FILE_TYPES: Record<string, string> = { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg" };

export function parseVideoUrl(input: string): VideoSource | null {
  let url: URL;
  try {
    url = new URL(input.trim(), "https://voorbeeld.invalid");
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  const youtube = (id: string | null | undefined) => (id && /^[\w-]{11}$/.test(id) ? ({ kind: "youtube", id } as const) : null);
  if (host === "youtu.be") return youtube(url.pathname.slice(1));
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [, first, second] = url.pathname.split("/");
    if (first === "watch") return youtube(url.searchParams.get("v"));
    if (first === "embed" || first === "shorts") return youtube(second);
    return null;
  }

  const vimeo = (id: string | undefined) => (id && /^\d{6,12}$/.test(id) ? ({ kind: "vimeo", id } as const) : null);
  if (host === "vimeo.com") return vimeo(url.pathname.split("/")[1]);
  if (host === "player.vimeo.com") return vimeo(url.pathname.split("/")[2]);

  const type = FILE_TYPES[url.pathname.split(".").pop()?.toLowerCase() ?? ""];
  // Een los bestand mag relatief (van dezelfde site) of een volledig adres zijn; geef het dan zoals ingevuld door.
  return type ? { kind: "file", src: input.trim(), type } : null;
}

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  // Voor schermlezers en zoekmachines; verplicht, ook als er geen zichtbare kop is.
  title: z.string().min(1).max(120),
  // Onder de 200 tekens, zodat het formulier er een enkelregelig veld van maakt.
  videoUrl: z
    .string()
    .min(1)
    .max(190)
    .refine((value) => parseVideoUrl(value) !== null, "Gebruik een YouTube- of Vimeo-adres, of een .mp4-, .webm- of .ogv-bestand"),
  poster: imageSchema,
  description: z.string().max(300).optional(),
  // Voor zoekmachines (VideoObject); zonder datum wordt die gegevensset weggelaten. Formaat: 2025-03-14.
  uploadDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Gebruik het formaat JJJJ-MM-DD")
    .optional(),
  transcript: z.string().max(4000).optional(),
});
export type VideoContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type VideoSettings = z.output<typeof settings>;

export type VideoFixture = Fixture<VideoVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
