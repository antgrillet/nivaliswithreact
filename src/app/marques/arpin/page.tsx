import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import ArpinDevisForm from "@/components/arpin/ArpinDevisForm";
import { getContent, getSiteSettings } from "@/lib/data/content";
import type { ContentValue, SectionContent, SiteSettings } from "@/lib/types";

export const revalidate = 300;

const CATALOGUE_HREF =
  "/api/download?file=Catalogue%20sur%20Mesure%20Arpin%202022.pdf";

const HERO_IMAGE = "/img/Arpin/image4.jpeg";

const PROCESS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Sélection de la laine",
    body: "Des toisons des Alpes choisies pour leur finesse et leur résistance, premières d'une chaîne entièrement maîtrisée.",
  },
  {
    n: "02",
    title: "Lavage & cardage",
    body: "La laine brute est nettoyée puis les fibres démêlées, préparées avec soin pour le filage.",
  },
  {
    n: "03",
    title: "Filage & tissage",
    body: "Le fil est tissé sur métiers à navette historiques, selon les gestes du Drap de Bonneval.",
  },
  {
    n: "04",
    title: "Foulonnage & finitions",
    body: "Feutré au foulon à eau, brossé puis tondu : un drap dense, chaud, fait pour traverser le temps.",
  },
];

const GALLERY: { src: string; alt: string }[] = [
  {
    src: "/img/Arpin/image4.jpeg",
    alt: "Couverture en laine Arpin — Drap de Bonneval tissé à la main",
  },
  {
    src: "/img/Arpin/image003.jpg",
    alt: "Plaid Arpin en laine de Savoie",
  },
  {
    src: "/img/Arpin/IMG_0253.jpg",
    alt: "Détail de tissage du drap de Bonneval Arpin",
  },
  {
    src: "/img/Arpin/IMG_1521.jpeg",
    alt: "Textile Arpin en laine naturelle",
  },
  {
    src: "/img/Arpin/IMG_1525.jpeg",
    alt: "Pièce d'habitat en laine Arpin",
  },
  {
    src: "/img/Arpin/IMG_1527.jpeg",
    alt: "Collection de textiles Arpin en laine de Savoie",
  },
];

const FACTS: [string, string][] = [
  ["1817", "Fondation à Séez, Savoie"],
  ["2005", "Classée Monument historique"],
  ["200+", "Ans de savoir-faire transmis"],
];

// --- Formes lues depuis le CMS (section "arpin"). Tout est optionnel : la
// page applique systématiquement les constantes ci-dessus en repli. ---
interface FactItem {
  value: string;
  label: string;
}

interface GalleryImage {
  src?: string;
  alt?: string;
}

// --- Accès défensifs typés sur ContentValue (Record<string, unknown>). ---
function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function block(section: SectionContent, key: string): ContentValue {
  const value = section[key];
  return value && typeof value === "object" ? (value as ContentValue) : {};
}

function objectList(value: unknown): ContentValue[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is ContentValue =>
          !!item && typeof item === "object" && !Array.isArray(item)
      )
    : [];
}

export default async function ArpinPage() {
  const [arpin, settings] = await Promise.all([
    getContent("arpin").catch((): SectionContent => ({})),
    getSiteSettings().catch((): SiteSettings => ({})),
  ]);

  const hero = block(arpin, "hero");
  const heritage = block(arpin, "heritage");
  const process = block(arpin, "process");
  const facts = block(arpin, "facts");
  const gallery = block(arpin, "gallery");
  const catalog = block(arpin, "catalog");

  // Hero
  const heroTitle = str(hero.title) ?? "Arpin";
  const heroSubtitle =
    str(hero.subtitle) ??
    "Manufacture de lainage française fondée en 1817. Le geste du tissage savoyard, perpétué dans l'atelier historique de Séez, au cœur des Alpes.";
  const heroImage = str(hero.image) ?? HERO_IMAGE;

  // Héritage : paragraphes (séparés par double saut de ligne) + citation
  const heritageContent = str(heritage.content);
  const heritageParagraphs = heritageContent
    ? heritageContent.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : null;
  const heritageQuote =
    str(heritage.quote) ??
    "Le patrimoine vivant d'un savoir-faire unique, classé au titre des Monuments historiques depuis 2005.";

  // Process : 4 étapes
  const cmsSteps = objectList(process.steps)
    .map((step) => ({
      n: str(step.n),
      title: str(step.title),
      body: str(step.body),
    }))
    .filter(
      (step): step is {
        n: string | undefined;
        title: string;
        body: string | undefined;
      } => step.title !== undefined
    );
  const processSteps =
    cmsSteps.length > 0
      ? cmsSteps.map((step, i) => ({
          n: step.n ?? PROCESS[i]?.n ?? String(i + 1).padStart(2, "0"),
          title: step.title,
          body: step.body ?? "",
        }))
      : PROCESS;

  // Repères chiffrés
  const cmsFacts = objectList(facts.items)
    .map((item) => ({ value: str(item.value), label: str(item.label) }))
    .filter(
      (item): item is FactItem =>
        item.value !== undefined && item.label !== undefined
    );
  const factItems: FactItem[] =
    cmsFacts.length > 0
      ? cmsFacts
      : FACTS.map(([value, label]) => ({ value, label }));

  // Galerie
  const cmsGallery = objectList(gallery.images)
    .map((item) => ({ src: str(item.src), alt: str(item.alt) }))
    .filter(
      (item): item is { src: string; alt: string | undefined } =>
        item.src !== undefined
    );
  const galleryImages: GalleryImage[] =
    cmsGallery.length > 0 ? cmsGallery : GALLERY;

  // Catalogue PDF
  const catalogueHref = str(catalog.file) ?? CATALOGUE_HREF;

  // Coordonnées contact
  const contact = settings.contact ?? {};
  const phone = contact.phone ?? "06 81 73 66 47";
  const email = contact.email ?? "contact@nivalislesgets.com";
  const boutique = contact.address ?? "Les Gets, Haute-Savoie";
  const phoneDigits = phone.replace(/[^\d]/g, "");
  const telHref = phoneDigits.startsWith("0")
    ? `tel:+33${phoneDigits.slice(1)}`
    : `tel:${phoneDigits}`;

  return (
    <main className="min-h-screen bg-background">
      <Navbar overHero />

      {/* Hero — plein cadre, noir & blanc */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-foreground text-background">
        <SafeImage
          src={heroImage}
          alt="Tissus de laine Arpin — savoir-faire savoyard depuis 1817"
          fill
          priority
          fallbackLabel="A"
          fallbackClassName="bg-foreground text-background/40"
          className="object-cover opacity-55 grayscale"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 to-foreground/15" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32 lg:px-10">
          <Link
            href="/marques"
            className="link-underline inline-flex items-center gap-2 text-sm text-background/70 transition-opacity hover:text-background"
          >
            <ArrowLeft className="size-4" />
            Retour aux marques
          </Link>

          <p className="eyebrow mt-10 text-background/55">
            Maison Arpin · depuis 1817
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-6xl tracking-tight md:text-8xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/75">
            {heroSubtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="#devis">
                Demander un devis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
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
      </section>

      {/* Héritage — 1817 */}
      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10">
          <div className="max-w-xl">
            <p className="eyebrow">Notre héritage</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Deux siècles de laine, un même geste
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
              {heritageParagraphs ? (
                heritageParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Fondée en 1817 dans le village de Séez, la Filature Arpin
                    perpétue depuis plus de deux cents ans l&apos;art du travail
                    de la laine. Véritable institution du patrimoine textile
                    français, elle transforme la laine brute en étoffes
                    d&apos;exception.
                  </p>
                  <p>
                    Des méthodes ancestrales et des gestes précis, transmis de
                    génération en génération, donnent naissance au fameux Drap de
                    Bonneval — un tissu dense, reconnu pour sa résistance et sa
                    chaleur incomparables.
                  </p>
                </>
              )}
            </div>

            <blockquote className="mt-10 border-l border-border pl-6">
              <p className="font-serif text-xl leading-relaxed tracking-tight text-foreground">
                « {heritageQuote} »
              </p>
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="img-zoom relative aspect-[3/4] overflow-hidden border border-border">
              <SafeImage
                src="/img/Arpin/image003.jpg"
                alt="Atelier de tissage Arpin à Séez, en Savoie"
                fill
                fallbackLabel="A"
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="img-zoom relative mt-10 aspect-[3/4] overflow-hidden border border-border">
              <SafeImage
                src="/img/Arpin/IMG_0253.jpg"
                alt="Détail du drap de Bonneval Arpin"
                fill
                fallbackLabel="A"
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* Repères chiffrés */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-10">
          <dl className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {factItems.map(({ value, label }) => (
              <div key={label} className="bg-background p-10 text-center">
                <dt className="font-serif text-4xl tracking-tight md:text-5xl">
                  {value}
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Savoir-faire — section sombre */}
      <section className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-xl">
            <p className="eyebrow text-background/55">Le savoir-faire</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              De la toison à l&apos;étoffe
            </h2>
            <p className="mt-6 leading-relaxed text-background/70">
              Chaque drap Arpin naît d&apos;une chaîne d&apos;ateliers maîtrisée
              de bout en bout, où les machines centenaires côtoient la main des
              artisans.
            </p>
          </div>

          <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-background/15 bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.n} className="bg-foreground p-8">
                <span className="font-serif text-3xl tracking-tight text-background/40">
                  {step.n}
                </span>
                <h3 className="mt-6 font-serif text-xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-background/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Galerie de tissus */}
      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">La collection</p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                Tissus & pièces d&apos;exception
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-muted-foreground">
              Plaids, couvertures, articles d&apos;habitat et créations
              sur-mesure : la laine de Savoie déclinée pour la maison comme pour
              le vêtement.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((item, i) => (
              <div
                key={(item.src ?? "") + i}
                className="img-zoom relative aspect-square overflow-hidden border border-border"
              >
                <SafeImage
                  src={item.src ?? ""}
                  alt={item.alt ?? ""}
                  fill
                  fallbackLabel="A"
                  className="object-cover grayscale"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue / PDF */}
      <section className="bg-secondary py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <div className="img-zoom relative aspect-[4/5] overflow-hidden border border-border">
            <SafeImage
              src="/img/Arpin/IMG_1522.jpeg"
              alt="Catalogue des créations sur-mesure Arpin"
              fill
              fallbackLabel="A"
              className="object-cover grayscale"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="max-w-lg">
            <p className="eyebrow">Le catalogue</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Découvrez les créations sur-mesure
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Explorez l&apos;ensemble des pièces Arpin, leurs coloris et leurs
              finitions dans notre catalogue complet. Idéal pour préparer une
              demande de devis ou un projet personnalisé.
            </p>

            <div className="mt-10">
              <Button asChild size="lg">
                <a href={catalogueHref} download>
                  Télécharger le catalogue (PDF)
                  <Download className="size-4" />
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Catalogue sur-mesure Arpin · format PDF
            </p>
          </div>
        </div>
      </section>

      {/* Demande de devis */}
      <section id="devis" className="bg-background py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:px-10">
          <div className="max-w-md">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Demander un devis
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Une pièce vous intéresse ou vous avez un projet sur-mesure ?
              Décrivez-nous votre besoin : notre équipe vous répond dans les
              meilleurs délais.
            </p>

            <dl className="mt-10 space-y-0 border-t border-border">
              <div className="flex items-center justify-between border-b border-border py-4">
                <dt className="text-sm text-muted-foreground">Téléphone</dt>
                <dd className="text-sm">
                  <a
                    href={telHref}
                    className="link-underline transition-colors hover:text-foreground"
                  >
                    {phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border py-4">
                <dt className="text-sm text-muted-foreground">E-mail</dt>
                <dd className="text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="link-underline break-all transition-colors hover:text-foreground"
                  >
                    {email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border py-4">
                <dt className="text-sm text-muted-foreground">Boutique</dt>
                <dd className="text-sm text-right">{boutique}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-border bg-card p-8 md:p-10">
            <ArpinDevisForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
