"use client";

import type { ComponentType } from "react";
import { useMockupVals } from "./MockupProvider";
import type { Vals } from "./logic";
import { BuilderScreen } from "./screens/Builder";
import { ComponentEditorScreen } from "./screens/ComponentEditor";
import { ComponentenScreen } from "./screens/Componenten";
import { DesignKitEditorScreen } from "./screens/DesignKitEditor";
import { DesignKitsScreen } from "./screens/DesignKits";
import { GalerijScreen } from "./screens/Galerij";
import { InstellingenScreen } from "./screens/Instellingen";
import { KlantenScreen } from "./screens/Klanten";
import { PlaceholderScreen } from "./screens/Placeholder";
import { PlatformScreen } from "./screens/Platform";
import { RapportKlantenScreen } from "./screens/RapportKlanten";
import { RapportOmzetScreen } from "./screens/RapportOmzet";

// Sleutel = de scherm-id uit de mockup; alles wat hier niet staat toont de placeholder.
const screens: Record<string, ComponentType<{ v: Vals }>> = {
  platform: PlatformScreen,
  klanten: KlantenScreen,
  websites: GalerijScreen,
  "websites/nieuw": BuilderScreen,
  apps: GalerijScreen,
  componenten: ComponentenScreen,
  "componenten/editor": ComponentEditorScreen,
  designkits: DesignKitsScreen,
  "designkits/editor": DesignKitEditorScreen,
  instellingen: InstellingenScreen,
  "rapportages/klanten": RapportKlantenScreen,
  "rapportages/omzet": RapportOmzetScreen,
};

export function MockupScreen({
  active,
  title,
  roster,
}: {
  active: string;
  title?: string;
  roster?: unknown[];
}) {
  const v = useMockupVals({ active, roster });
  const Screen = screens[active] ?? PlaceholderScreen;
  return <Screen v={{ ...v, pageTitle: title ?? "" }} />;
}
