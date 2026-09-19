// Menustructuur uit de Claude Design-mockup. `icon` is een Phosphor-icoonnaam (zonder "ph-").
export type NavChild = { label: string; icon: string; href: string };
export type NavItem = NavChild & { children?: NavChild[]; gapAfter?: boolean };

export const nav: NavItem[] = [
  { label: "Platform", icon: "squares-four", href: "/", gapAfter: true },
  {
    label: "Klanten",
    icon: "users-three",
    href: "/klanten",
    children: [{ label: "Nieuwe klant", icon: "plus", href: "/klanten/nieuw" }],
  },
  {
    label: "Websites",
    icon: "browsers",
    href: "/websites",
    children: [{ label: "Nieuwe website", icon: "plus", href: "/websites/nieuw" }],
  },
  {
    label: "Apps",
    icon: "app-window",
    href: "/apps",
    gapAfter: true,
    children: [{ label: "Nieuwe app", icon: "plus", href: "/apps/nieuw" }],
  },
  {
    label: "Componenten",
    icon: "puzzle-piece",
    href: "/componenten",
    children: [{ label: "Editor", icon: "pen-nib", href: "/componenten/editor" }],
  },
  {
    label: "Design kits",
    icon: "palette",
    href: "/design-kits",
    gapAfter: true,
    children: [{ label: "Editor", icon: "pen-nib", href: "/design-kits/editor" }],
  },
  {
    label: "Rapportages",
    icon: "chart-line-up",
    href: "/rapportages/klanten",
    gapAfter: true,
    children: [
      { label: "Klantrapporten", icon: "file-text", href: "/rapportages/klanten" },
      { label: "Omzet & marge", icon: "coins", href: "/rapportages/omzet" },
    ],
  },
  { label: "Instellingen", icon: "gear-six", href: "/instellingen" },
];
