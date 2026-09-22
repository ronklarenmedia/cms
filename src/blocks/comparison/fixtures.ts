import type { ComparisonFixture } from "./schema";

export const fixtures: ComparisonFixture[] = [
  {
    name: "Drie pakketten vergeleken",
    variant: "table",
    content: {
      eyebrow: "Pakketten",
      heading: "Welk pakket past bij je?",
      intro: "Een overzicht van wat elk pakket precies bevat.",
      columns: [{ name: "Starter" }, { name: "Pro", highlighted: true }, { name: "Agency" }],
      rows: [
        { label: "Aantal pagina's", values: ["5", "15", "Onbeperkt"] },
        { label: "Eigen domein", values: ["Ja", "Ja", "Ja"] },
        { label: "Design kit op maat", values: ["—", "Ja", "Ja"] },
        { label: "Ondersteuning", values: ["E-mail", "E-mail en telefoon", "Vast aanspreekpunt"] },
        { label: "Reactietijd", values: ["2 werkdagen", "1 werkdag", "Dezelfde dag"] },
      ],
    },
  },
  {
    name: "Compact, twee kolommen",
    variant: "compact",
    content: {
      heading: "Zelf beheren of uitbesteden?",
      columns: [{ name: "Zelf beheren" }, { name: "Uitbesteden", highlighted: true }],
      rows: [
        { label: "Teksten aanpassen", values: ["Ja", "Ja"] },
        { label: "Nieuwe pagina's bouwen", values: ["Zelf", "Voor je gedaan"] },
        { label: "Technisch onderhoud", values: ["Zelf", "Inbegrepen"] },
      ],
    },
  },
];
