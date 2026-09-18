import {
  AppWindow,
  Browsers,
  ChartLineUp,
  Coins,
  FileText,
  GearSix,
  type Icon,
  PenNib,
  Palette,
  Plus,
  PuzzlePiece,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react";

export type NavChild = { label: string; icon: Icon; href?: string };
export type NavItem = NavChild & { children?: NavChild[]; gapAfter?: boolean };

// Menustructuur uit de Claude Design-mockup. Items zonder `href` hebben nog geen pagina
// en verschijnen uitgeschakeld in het menu.
export const nav: NavItem[] = [
  { label: "Platform", icon: SquaresFour, gapAfter: true },
  {
    label: "Klanten",
    icon: UsersThree,
    href: "/klanten",
    children: [{ label: "Nieuwe klant", icon: Plus, href: "/klanten/nieuw" }],
  },
  {
    label: "Websites",
    icon: Browsers,
    children: [{ label: "Nieuwe website", icon: Plus }],
  },
  {
    label: "Apps",
    icon: AppWindow,
    gapAfter: true,
    children: [{ label: "Nieuwe app", icon: Plus }],
  },
  {
    label: "Componenten",
    icon: PuzzlePiece,
    children: [{ label: "Editor", icon: PenNib }],
  },
  {
    label: "Design kits",
    icon: Palette,
    gapAfter: true,
    children: [{ label: "Editor", icon: PenNib }],
  },
  {
    label: "Rapportages",
    icon: ChartLineUp,
    gapAfter: true,
    children: [
      { label: "Klantrapporten", icon: FileText },
      { label: "Omzet & marge", icon: Coins },
    ],
  },
  { label: "Instellingen", icon: GearSix },
];
