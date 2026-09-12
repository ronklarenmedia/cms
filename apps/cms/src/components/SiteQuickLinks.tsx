"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import React from "react";

// Snelkoppelingen op het bewerkscherm van een Site: rechtstreeks naar de
// (voorgefilterde) pagina's en media van déze site. Geen volledige
// drill-down-navigatie (dat is een apart project), maar wel een snelle
// manier om te zien wat bij deze site hoort zonder de hele Pages/Media-lijst
// door te spitten.
export const SiteQuickLinks: React.FC = () => {
  const { id } = useDocumentInfo();

  if (!id) {
    return (
      <p style={{ opacity: 0.6 }}>
        Snelkoppelingen naar pagina's en media zijn beschikbaar nadat je deze site hebt opgeslagen.
      </p>
    );
  }

  const filter = `where%5Bsite%5D%5Bequals%5D=${encodeURIComponent(String(id))}`;

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <a className="btn btn--style-secondary btn--size-small" href={`/admin/collections/pages?${filter}`}>
        Bekijk pagina's van deze site
      </a>
      <a className="btn btn--style-secondary btn--size-small" href={`/admin/collections/media?${filter}`}>
        Bekijk media van deze site
      </a>
    </div>
  );
};
