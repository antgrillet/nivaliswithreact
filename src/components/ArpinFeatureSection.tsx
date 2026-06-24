import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";
import { ArrowRight, Download } from "lucide-react";

const FEATURE_IMAGE = "/img/Arpin/image4.jpeg";

const FEATURE_PARAGRAPH =
  "Fondée en 1817, la maison Arpin perpétue l'art ancestral du tissage de la laine dans son atelier historique de Séez, en Savoie. Chaque pièce témoigne d'un patrimoine vivant, façonné par des artisans passionnés.";

const CATALOGUE_HREF =
  "/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf";

const POINTS = [
  "Laines naturelles sélectionnées, tissées en Savoie",
  "Technique de tissage préservée depuis plus de 200 ans",
  "Collections alliant héritage et modernité",
];

// Contenu reçu depuis le CMS (homepage → sous-section `arpin`). Tout est
// optionnel : le composant applique les constantes ci-dessus en repli.
interface ArpinFeatureContent {
  title?: string;
  subtitle?: string;
  image?: string;
  paragraph?: string;
  points?: string[];
  catalogFile?: string;
}

export default function ArpinFeatureSection({
  content,
}: {
  content?: ArpinFeatureContent;
}) {
  const image = content?.image?.trim() || FEATURE_IMAGE;
  const paragraph = content?.paragraph?.trim() || FEATURE_PARAGRAPH;
  const catalogueHref = content?.catalogFile?.trim() || CATALOGUE_HREF;
  const points =
    Array.isArray(content?.points) &&
    content.points.filter((p) => typeof p === "string" && p.trim()).length > 0
      ? content.points.filter((p) => typeof p === "string" && p.trim())
      : POINTS;

  return (
    <section className="bg-foreground py-24 text-background md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
        <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-muted">
          <SafeImage
            src={image}
            alt="Tissus de laine Arpin"
            fill
            fallbackLabel="A"
            fallbackClassName="bg-muted text-muted-foreground"
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="eyebrow text-background/50">Maison Arpin · depuis 1817</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            {content?.title || "L'excellence d'un savoir-faire inégalé"}
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-background/70">
            {paragraph}
          </p>

          <ul className="mt-10 space-y-0 border-t border-background/15">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-4 border-b border-background/15 py-4 text-sm text-background/80"
              >
                <span className="text-background/40">—</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/marques/arpin">
                Découvrir Arpin
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-background/30 bg-transparent text-background hover:border-background hover:bg-background/10 hover:text-background"
            >
              <a href={catalogueHref} download>
                Catalogue PDF
                <Download className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
