// Nederlandse namen voor de velden en waarden die uit de block-schema's komen.
// Onbekende sleutels vallen terug op een leesbare versie van de veldnaam.
const fields: Record<string, string> = {
  eyebrow: "Bovenkop",
  heading: "Kop",
  body: "Tekst",
  intro: "Inleiding",
  text: "Tekst",
  icon: "Icoon (emoji)",
  items: "Items",
  buttons: "Knoppen",
  label: "Label",
  href: "Link",
  style: "Stijl",
  media: "Afbeelding",
  url: "Afbeeldings-URL",
  alt: "Alt-tekst",
  width: "Breedte (px)",
  height: "Hoogte",
  decorative: "Puur decoratief",
  background: "Achtergrond",
  paddingY: "Ruimte boven en onder",
  maxWidth: "Maximale breedte",
  align: "Uitlijning",
  visibility: "Zichtbaarheid",
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobiel",
  anchor: "Anker (voor #-links)",
  columns: "Kolommen",
  aspect: "Vorm van de beelden",
  title: "Titel",
  date: "Datum",
  tag: "Label",
  tags: "Tags",
  images: "Afbeeldingen",
  image: "Afbeelding",
  caption: "Bijschrift",
  client: "Klant",
  summary: "Samenvatting",
  cta: "Tekst onderaan de kaart",
  poster: "Posterafbeelding",
  videoUrl: "Video-adres (YouTube, Vimeo of .mp4)",
  description: "Omschrijving",
  uploadDate: "Uploaddatum (JJJJ-MM-DD)",
  transcript: "Tekst van de video",
};

const values: Record<string, Record<string, string>> = {
  background: {
    none: "Geen",
    "off-white": "Gebroken wit",
    "primary-light": "Primair licht",
    "secondary-light": "Secundair licht",
    primary: "Primair",
    "primary-dark": "Primair donker",
    black: "Zwart",
  },
  paddingY: { xs: "XS", small: "Klein", standard: "Standaard", medium: "Medium", large: "Groot", xl: "XL", xxl: "XXL" },
  maxWidth: { small: "Smal", standard: "Standaard", medium: "Medium", large: "Groot", full: "Volledig" },
  align: { left: "Links", center: "Midden" },
  height: { compact: "Compact", normal: "Normaal", full: "Volledig scherm" },
  style: { primary: "Primair", secondary: "Secundair" },
  aspect: { photo: "Foto", square: "Vierkant", video: "Video (breed)" },
};

const humanize = (s: string) => {
  const spaced = s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const fieldLabel = (key: string) => fields[key] ?? humanize(key);
export const valueLabel = (key: string, value: string) => values[key]?.[value] ?? humanize(value);

// Beginwaarden voor verplichte tekstvelden van een nieuw item/object, zodat dat direct geldig is.
export const placeholders: Record<string, string> = {
  heading: "Nieuwe kop",
  label: "Knop",
  href: "/",
  url: "/blocks/demo-photo.svg",
  alt: "Beschrijf de afbeelding",
};

/** Tekstvelden die een meerregelig veld krijgen. */
export const longTextKeys = new Set(["body", "intro", "text"]);
