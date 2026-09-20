import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import { JsonLd } from "../parts/JsonLd";
import { parseVideoUrl, type VideoContent, type VideoSettings, type VideoVariant } from "./schema";

export function Video({ variant, content }: BlockProps<VideoVariant, VideoContent, VideoSettings>) {
  const { eyebrow, heading, intro, title, videoUrl, poster, description, uploadDate, transcript } = content;
  const source = parseVideoUrl(videoUrl);
  if (!source) return null; // het schema laat dit niet toe; dit is alleen voor het type
  const hasHeader = Boolean(eyebrow || heading || intro);

  // Het ingevulde adres wordt nooit rechtstreeks gebruikt: het embed-adres wordt uit het herkende id opgebouwd.
  const embedUrl =
    source.kind === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source.id}`
      : source.kind === "vimeo"
        ? `https://player.vimeo.com/video/${source.id}?dnt=1`
        : null;

  const jsonLdData = uploadDate
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description: description ?? title,
        thumbnailUrl: poster.url,
        uploadDate,
        ...(embedUrl ? { embedUrl } : { contentUrl: source.kind === "file" ? source.src : undefined }),
      }
    : null;

  return (
    <div className={`blk-video blk-video--${variant}`}>
      {jsonLdData && <JsonLd data={jsonLdData} />}
      {hasHeader && (
        <header className="blk-video__header">
          {eyebrow && <p className="blk-video__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-video__heading">{heading}</h2>}
          {intro && <p className="blk-video__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-video__media">
        <div className="blk-video__player">
          {embedUrl ? (
            // Klik-om-te-laden zonder JavaScript: de speler staat in een ingeklapte <details> en wordt pas geladen als
            // die opengaat. Dat scheelt de zware YouTube- of Vimeo-code bij bezoekers die niet afspelen.
            <details className="blk-video__facade">
              <summary className="blk-video__summary" aria-label={`Video afspelen: ${title}`}>
                <Img image={poster} />
                <span className="blk-video__play" aria-hidden="true" />
              </summary>
              <iframe
                className="blk-video__frame"
                src={embedUrl}
                title={title}
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </details>
          ) : (
            <video className="blk-video__file" controls preload="none" playsInline poster={poster.url} aria-label={title}>
              <source src={source.kind === "file" ? source.src : undefined} type={source.kind === "file" ? source.type : undefined} />
              Je browser kan deze video niet afspelen.
            </video>
          )}
        </div>

        {transcript && (
          <details className="blk-video__transcript">
            <summary className="blk-video__transcript-summary">Tekst van de video</summary>
            {transcript.split(/\n{2,}/).map((paragraph, idx) => (
              <p key={idx} className="blk-video__transcript-text">
                {paragraph}
              </p>
            ))}
          </details>
        )}
      </div>
    </div>
  );
}
