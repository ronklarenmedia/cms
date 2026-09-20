import type { VideoFixture } from "./schema";

const poster = { url: "/blocks/demo-photo.svg", alt: "Beeld uit de video: een team aan het werk", width: 800, height: 450 };

export const fixtures: VideoFixture[] = [
  {
    name: "Breed, YouTube met transcript",
    variant: "wide",
    content: {
      eyebrow: "Kijk mee",
      heading: "Zo werken wij",
      intro: "In twee minuten laten we zien hoe een website van idee tot livegang komt.",
      title: "Zo werken wij: van idee tot livegang",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      poster,
      description: "Een korte kijk in onze werkwijze, met voorbeelden van opgeleverde websites.",
      uploadDate: "2025-03-14",
      transcript:
        "Welkom bij Ron Klaren Media. We beginnen altijd met een kennismaking.\n\nDaarna laten we snel een eerste voorbeeld zien, zodat je kunt bijsturen.",
    },
  },
  {
    name: "Split, Vimeo naast tekst",
    variant: "split",
    content: {
      eyebrow: "Klantverhaal",
      heading: "Robuust over de samenwerking",
      intro: "De eigenaar vertelt hoe de nieuwe website extra aanvragen opleverde.",
      title: "Robuust Hovenierswerk over de nieuwe website",
      videoUrl: "https://vimeo.com/76979871",
      poster,
    },
  },
  {
    name: "Breed, eigen videobestand",
    variant: "wide",
    content: {
      title: "Rondleiding door de werkplaats",
      videoUrl: "/blocks/rondleiding.mp4",
      poster,
    },
  },
  {
    name: "Minimaal, alleen verplichte velden",
    variant: "wide",
    content: {
      title: "Korte introductie",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      poster,
    },
  },
];
