"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import React from "react";

// Opent de read-only pagina-preview (apps/site/src/pages/preview/[id].astro)
// in een nieuw tabblad. NEXT_PUBLIC_SITE_PREVIEW_URL laten instellen per
// omgeving (default = lokale site-devserver, zie .claude/launch.json).
const PREVIEW_BASE_URL = process.env.NEXT_PUBLIC_SITE_PREVIEW_URL || "http://localhost:4321";

export const PagePreviewLink: React.FC = () => {
  const { id } = useDocumentInfo();

  if (!id) {
    return (
      <p style={{ opacity: 0.6 }}>
        Voorbeeld is beschikbaar nadat je deze pagina hebt opgeslagen.
      </p>
    );
  }

  return (
    <a
      className="btn btn--style-secondary btn--size-small"
      href={`${PREVIEW_BASE_URL}/preview/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Voorbeeld bekijken
    </a>
  );
};
