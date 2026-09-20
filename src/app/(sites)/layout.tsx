import "@/blocks/blocks.css";
import "./sites.css";

// Basislayout voor openbare sites: alleen <html> en <body>. Geen sessie, geen platformmenu, geen beheerstijlen, zodat
// deze pagina's volledig statisch kunnen zijn en gecachet worden.
export default function SitesRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
