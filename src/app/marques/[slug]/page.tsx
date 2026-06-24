import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandCard from "@/components/BrandCard";
import ImageGallery from "@/components/ImageGallery";
import { SafeImage } from "@/components/SafeImage";
import {
  getMarques,
  getMarqueBySlug,
  getSimilarMarques,
} from "@/lib/data/marques";
import { slugify } from "@/lib/slug";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const marques = await getMarques();
  return marques.map((m) => ({ slug: slugify(m.nom) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marque = await getMarqueBySlug(slug);

  if (!marque) {
    return { title: "Marque introuvable — Nivalis" };
  }

  const label = marque.displayName?.trim() || marque.nom;
  const description =
    marque.description?.trim() ||
    `Découvrez ${label}, une sélection disponible chez Nivalis, maison de marques premium aux Gets.`;

  return {
    title: `${label} — Nivalis`,
    description: description.slice(0, 160),
  };
}

export default async function MarqueDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const marque = await getMarqueBySlug(slug);

  if (!marque) notFound();

  const label = marque.displayName?.trim() || marque.nom;
  const similar = await getSimilarMarques(marque);
  const gallery = (marque.images ?? []).filter(Boolean);

  // Le type contact tolère deux variantes de nommage (FR/EN).
  const contact = marque.contact;
  const adresse = contact?.adresse ?? contact?.address;
  const telephone = contact?.telephone ?? contact?.phone;
  const websiteLabel = marque.website?.replace(/^https?:\/\/(www\.)?/, "");

  const hasContact = Boolean(
    adresse ||
      telephone ||
      contact?.email ||
      contact?.horaires ||
      marque.website
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* En-tête éditorial */}
      <section className="border-b border-border pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            href="/marques"
            className="link-underline inline-flex items-center gap-2 pb-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Toutes les marques
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-5">
                <div className="img-zoom relative size-16 shrink-0 overflow-hidden border border-border bg-card md:size-20">
                  <SafeImage
                    src={marque.logo}
                    alt={`Logo ${label}`}
                    fill
                    fallbackLabel={label.charAt(0)}
                    className="object-contain p-3"
                    sizes="80px"
                  />
                </div>
                {marque.type ? (
                  <span className="eyebrow">{marque.type}</span>
                ) : null}
              </div>

              <h1 className="mt-8 font-serif text-5xl tracking-tight md:text-6xl lg:text-7xl">
                {label}
              </h1>

              {marque.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {marque.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {marque.description ? (
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {marque.description}
                </p>
              ) : null}

              {marque.website ? (
                <a
                  href={marque.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium tracking-wide text-foreground"
                >
                  Visiter le site officiel
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : null}
            </div>

            {/* Image héro */}
            <div className="lg:col-span-5">
              <div className="img-zoom relative aspect-[4/5] overflow-hidden border border-border bg-muted">
                <SafeImage
                  src={marque.mainImage}
                  alt={`Univers ${label}`}
                  fill
                  priority
                  fallbackLabel={label.charAt(0)}
                  className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie */}
      {gallery.length > 0 ? (
        <ImageGallery images={gallery} nom={label} />
      ) : null}

      {/* Histoire et valeurs */}
      {marque.histoire ? (
        <section className="border-t border-border bg-secondary py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-4">
                <p className="eyebrow">Histoire &amp; valeurs</p>
                <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
                  L&apos;esprit de la maison
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="whitespace-pre-line text-lg leading-relaxed text-foreground/80">
                  {marque.histoire}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Produits phares */}
      {marque.produits && marque.produits.length > 0 ? (
        <section className="border-t border-border bg-background py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <p className="eyebrow">La sélection</p>
            <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
              Produits phares
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {marque.produits.map((produit, i) => (
                <article key={produit.id ?? `${produit.nom}-${i}`}>
                  <div className="img-zoom relative aspect-[4/5] overflow-hidden border border-border bg-muted">
                    <SafeImage
                      src={produit.image}
                      alt={produit.nom}
                      fill
                      fallbackLabel={produit.nom.charAt(0)}
                      className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-xl tracking-tight">
                      {produit.nom}
                    </h3>
                    {produit.prix ? (
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {produit.prix}
                      </span>
                    ) : null}
                  </div>
                  {produit.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {produit.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Contact et coordonnées */}
      {hasContact ? (
        <section className="border-t border-border bg-foreground py-20 text-background md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-4">
                <p className="eyebrow text-background/50">Contact</p>
                <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
                  Coordonnées
                </h2>
              </div>

              <dl className="grid gap-px overflow-hidden border border-background/15 bg-background/15 sm:grid-cols-2 lg:col-span-8">
                {adresse ? (
                  <div className="bg-foreground p-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/50">
                      <MapPin className="size-4" />
                      Adresse
                    </dt>
                    <dd className="mt-3 whitespace-pre-line text-sm leading-relaxed text-background/80">
                      {adresse}
                    </dd>
                  </div>
                ) : null}

                {telephone ? (
                  <div className="bg-foreground p-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/50">
                      <Phone className="size-4" />
                      Téléphone
                    </dt>
                    <dd className="mt-3 text-sm text-background/80">
                      <a
                        href={`tel:${telephone.replace(/\s+/g, "")}`}
                        className="link-underline pb-0.5 transition-colors hover:text-background"
                      >
                        {telephone}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {contact?.email ? (
                  <div className="bg-foreground p-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/50">
                      <Mail className="size-4" />
                      Email
                    </dt>
                    <dd className="mt-3 text-sm text-background/80">
                      <a
                        href={`mailto:${contact.email}`}
                        className="link-underline break-all pb-0.5 transition-colors hover:text-background"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {contact?.horaires ? (
                  <div className="bg-foreground p-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/50">
                      <Clock className="size-4" />
                      Horaires
                    </dt>
                    <dd className="mt-3 whitespace-pre-line text-sm leading-relaxed text-background/80">
                      {contact.horaires}
                    </dd>
                  </div>
                ) : null}

                {marque.website ? (
                  <div className="bg-foreground p-6">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/50">
                      <ArrowUpRight className="size-4" />
                      Site web
                    </dt>
                    <dd className="mt-3 text-sm text-background/80">
                      <a
                        href={marque.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline break-all pb-0.5 transition-colors hover:text-background"
                      >
                        {websiteLabel}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {/* Marques similaires */}
      {similar.length > 0 ? (
        <section className="border-t border-border bg-background py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">À découvrir aussi</p>
                <h2 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
                  Marques similaires
                </h2>
              </div>
              <Link
                href="/marques"
                className="link-underline pb-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Toutes les marques
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
              {similar.map((m) => (
                <BrandCard
                  key={m.nom}
                  nom={m.nom}
                  displayName={m.displayName}
                  type={m.type}
                  mainImage={m.mainImage}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
