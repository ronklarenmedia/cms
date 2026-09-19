import type { Image } from "../contract";

/**
 * Enige plek waar een block een <img> rendert. Later te vervangen door next/image
 * (of een CDN-transformatie) zonder dat een block hoeft te veranderen.
 * `priority` hoort alleen bij het beeld boven de vouw (Hero).
 */
export function Img({ image, priority = false }: { image: Image; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.decorative ? "" : image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
