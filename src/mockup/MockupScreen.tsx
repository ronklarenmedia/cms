"use client";

import type { ComponentType } from "react";
import { useMockupVals } from "./MockupProvider";
import type { Vals } from "./logic";
import { GalerijScreen } from "./screens/Galerij";
import { KlantenScreen } from "./screens/Klanten";
import { PlaceholderScreen } from "./screens/Placeholder";
import { RapportKlantenScreen } from "./screens/RapportKlanten";
import { RapportOmzetScreen } from "./screens/RapportOmzet";

// Sleutel = de scherm-id uit de mockup; alles wat hier niet staat toont de placeholder.
// "websites/nieuw" (de oude mockup-builder) is verwijderd: /websites/nieuw heeft een eigen echt formulier (NewSiteForm).
const screens: Record<string, ComponentType<{ v: Vals }>> = {
  klanten: KlantenScreen,
  websites: GalerijScreen,
  apps: GalerijScreen,
  "rapportages/klanten": RapportKlantenScreen,
  "rapportages/omzet": RapportOmzetScreen,
};

export function MockupScreen({
  active,
  title,
  roster,
  sites,
}: {
  active: string;
  title?: string;
  roster?: unknown[];
  sites?: unknown[];
}) {
  const v = useMockupVals({ active, roster, sites });
  const Screen = screens[active] ?? PlaceholderScreen;
  return <Screen v={{ ...v, pageTitle: title ?? "" }} />;
}
