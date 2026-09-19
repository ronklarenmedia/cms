import type { UspGridFixture } from "./schema";

const items = [
  { icon: "⚡", heading: "Razendsnel", text: "Geoptimaliseerd voor Core Web Vitals, met minimale JavaScript." },
  { icon: "🔎", heading: "Goed vindbaar", text: "Semantische HTML en gestructureerde data voor zoekmachines én AI." },
  { icon: "🎨", heading: "Jouw huisstijl", text: "Eén design-kit stuurt kleuren, lettertypes en vormen aan." },
];

export const fixtures: UspGridFixture[] = [
  {
    name: "Eenvoudig, drie kolommen met kop",
    variant: "plain",
    content: { eyebrow: "Waarom wij", heading: "Alles wat een site nodig heeft", intro: "Drie redenen om te kiezen voor een vaste basis.", items },
  },
  {
    name: "Kaarten, vier kolommen",
    variant: "cards",
    content: {
      heading: "Onze aanpak",
      items: [...items, { icon: "🤝", heading: "Persoonlijk", text: "Een vast aanspreekpunt van intake tot livegang." }],
    },
    settings: { columns: "4", background: "off-white" },
  },
  {
    name: "Gecentreerd, minimaal (alleen items, zonder icoon)",
    variant: "centered",
    content: { items: [{ heading: "Snel" }, { heading: "Veilig" }, { heading: "Schaalbaar" }] },
    settings: { align: "center" },
  },
  {
    name: "Kaarten op donkere achtergrond, twee kolommen",
    variant: "cards",
    content: { heading: "Zo werken we", items: items.slice(0, 2) },
    settings: { columns: "2", background: "primary-dark" },
  },
];
