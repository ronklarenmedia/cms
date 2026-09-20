import type { Image } from "../contract";

/**
 * Enige plek waar een block een <img> rendert. Later te vervangen door next/image
 * (of een CDN-transformatie) zonder dat een block hoeft te veranderen.
 * `priority` hoort alleen bij het beeld boven de vouw (Hero). `sizes` vertelt de browser hoe breed het beeld op het
 * scherm wordt getoond (standaard de volle breedte), zodat hij de kleinste passende variant uit `srcset` kiest.
 */
export function Img({ image, priority = false, sizes = "100vw" }: { image: Image; priority?: boolean; sizes?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      srcSet={image.srcset}
      sizes={image.srcset ? sizes : undefined}
      alt={image.decorative ? "" : image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
