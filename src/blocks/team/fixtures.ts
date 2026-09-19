import type { TeamFixture } from "./schema";

export const fixtures: TeamFixture[] = [
  {
    name: "Drie kaarten met portretten",
    variant: "cards",
    content: {
      eyebrow: "Ons team",
      heading: "De specialisten achter het succes",
      intro: "Een gepassioneerd team van ontwerpers, ontwikkelaars en strategen.",
      members: [
        {
          name: "Lotte van den Berg",
          role: "Lead Designer & Oprichter",
          bio: "Gepassioneerd over doordacht design, typografie en converterende interfaces.",
          image: {
            url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=750&q=80",
            alt: "Portret van Lotte van den Berg",
            width: 600,
            height: 750,
          },
        },
        {
          name: "Daan de Vries",
          role: "Senior Full-Stack Developer",
          bio: "Bouwt razendsnelle websites met focus op web standaarden en security.",
          image: {
            url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=750&q=80",
            alt: "Portret van Daan de Vries",
            width: 600,
            height: 750,
          },
        },
        {
          name: "Sanne Meijer",
          role: "Content & SEO Strateeg",
          bio: "Zorgt dat jouw boodschap helder overkomt en hoog scoort in zoekmachines.",
          image: {
            url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=750&q=80",
            alt: "Portret van Sanne Meijer",
            width: 600,
            height: 750,
          },
        },
      ],
    },
    settings: {
      maxWidth: "large",
      columns: "3",
    },
  },
  {
    name: "Ronde portretten",
    variant: "round",
    content: {
      heading: "Ontmoet ons team",
      members: [
        {
          name: "Tim Janssen",
          role: "Art Director",
          image: {
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
            alt: "Portret van Tim Janssen",
            width: 400,
            height: 400,
          },
        },
        {
          name: "Emma Bakker",
          role: "Frontend Specialist",
          image: {
            url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
            alt: "Portret van Emma Bakker",
            width: 400,
            height: 400,
          },
        },
      ],
    },
    settings: {
      columns: "2",
      align: "center",
    },
  },
  {
    name: "Minimalistische lijst",
    variant: "minimal",
    content: {
      eyebrow: "Mensen",
      heading: "Wie we zijn",
      members: [
        {
          name: "Ruben Mulder",
          role: "Projectmanager",
          bio: "Houdt overzicht over planning, deadlines en budgetten.",
          image: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
            alt: "Portret van Ruben Mulder",
            width: 400,
            height: 400,
          },
        },
      ],
    },
  },
];
