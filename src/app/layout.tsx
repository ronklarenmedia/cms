import type { Metadata } from "next";
import { Fraunces, Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import "@phosphor-icons/web/regular";
import { AppShell } from "./AppShell";
import { MockupProvider } from "@/mockup/MockupProvider";
import "./globals.css";
import "@/mockup/hover.css";
import { getPlatformSettings } from "@/lib/platform-settings";
import { getSessionUser } from "@/lib/session";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Voorbeeldlettertypes voor de design-kit- en componenteditor.
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export async function generateMetadata(): Promise<Metadata> {
  const { platformName } = await getPlatformSettings();
  return {
    title: `${platformName} — Platform`,
    description: "Beheeromgeving voor klanten, websites en apps",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Alleen voor het menu (naam en rol); de echte toegangscontrole staat bij de data zelf.
  const user = await getSessionUser();
  const { platformName } = await getPlatformSettings();

  return (
    <html
      lang="nl"
      className={`${inter.variable} ${playfair.variable} ${fraunces.variable} ${sourceSerif.variable}`}
    >
      <body className="antialiased">
        <MockupProvider>
          <AppShell user={user} platformName={platformName}>{children}</AppShell>
        </MockupProvider>
      </body>
    </html>
  );
}
