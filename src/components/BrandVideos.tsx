import { PlayCircle } from "lucide-react";

const FILE_RE = /\.(mp4|webm|mov|m4v|ogv)$/i;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "le lien";
  }
}

/** Convertit une URL YouTube/Vimeo en URL d'embed, sinon null. */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function BrandVideos({
  videos,
  nom,
}: {
  videos: string[];
  nom: string;
}) {
  const clean = videos.filter((v) => v && v.trim());
  if (clean.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="eyebrow">En mouvement</p>
        <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
          Vidéos
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {clean.map((url, i) => {
            const embed = embedUrl(url);
            const isFile = FILE_RE.test(url);

            if (embed) {
              return (
                <div
                  key={`${url}-${i}`}
                  className="relative aspect-video overflow-hidden border border-border bg-muted"
                >
                  <iframe
                    src={embed}
                    title={`Vidéo ${nom} ${i + 1}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 size-full"
                  />
                </div>
              );
            }

            if (isFile) {
              return (
                <video
                  key={`${url}-${i}`}
                  src={url}
                  controls
                  preload="metadata"
                  className="aspect-video w-full border border-border bg-muted object-cover"
                />
              );
            }

            return (
              <a
                key={`${url}-${i}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-video flex-col items-center justify-center gap-3 border border-border bg-muted text-center transition-colors hover:bg-secondary"
              >
                <PlayCircle className="size-8 text-muted-foreground transition-transform group-hover:scale-105" />
                <span className="text-sm font-medium text-foreground">
                  Voir sur {hostOf(url)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
