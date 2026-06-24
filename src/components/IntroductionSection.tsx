import { getSiteSettings } from "@/lib/data/content";

interface IntroductionContent {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  hours?: string;
  address?: string;
}

const DEFAULTS = {
  title: "Bienvenue à Nivalis",
  paragraph1:
    "Votre boutique de vêtements et accessoires de montagne aux Gets. Située au cœur de la station, nous proposons une sélection soignée des plus grandes maisons outdoor et lifestyle.",
  paragraph2:
    "Venez découvrir un espace chaleureux où essayer et choisir vos pièces, avec l'accompagnement d'une équipe passionnée.",
  hours: "Lun–Dim : 9h30 – 19h00",
  address: "21 Rte du Front de Neige, 74260 Les Gets",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5833857036487!2d6.710054600000001!3d46.1521957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c11d7b4eb2473%3A0x96bb0c34c1f9df2!2s21%20Rte%20du%20Front%20de%20Neige%2C%2074260%20Les%20Gets!5e0!3m2!1sfr!2sfr!4v1626345678901!5m2!1sfr!2sfr",
};

export default async function IntroductionSection({
  content,
}: {
  content?: IntroductionContent;
}) {
  const settings = await getSiteSettings();
  const contact = settings.contact ?? {};

  // Source unique de vérité : réglages du site > contenu de section > défauts.
  const title = content?.title || DEFAULTS.title;
  const paragraph1 = content?.paragraph1 || DEFAULTS.paragraph1;
  const paragraph2 = content?.paragraph2 ?? DEFAULTS.paragraph2;
  const hours = contact.hours || content?.hours || DEFAULTS.hours;
  const address = contact.address || content?.address || DEFAULTS.address;
  const mapsEmbedUrl = contact.mapsEmbedUrl || DEFAULTS.mapsEmbedUrl;

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:items-center lg:px-10">
        <div>
          <p className="eyebrow">La maison</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            {title}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>{paragraph1}</p>
            {paragraph2 ? <p>{paragraph2}</p> : null}
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <div className="bg-background p-6">
              <dt className="eyebrow">Horaires</dt>
              <dd className="mt-2 text-sm text-foreground">{hours}</dd>
            </div>
            <div className="bg-background p-6">
              <dt className="eyebrow">Adresse</dt>
              <dd className="mt-2 text-sm text-foreground">{address}</dd>
            </div>
          </dl>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border border-border">
          <iframe
            src={mapsEmbedUrl}
            className="h-full w-full grayscale"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation de la boutique Nivalis aux Gets"
          />
        </div>
      </div>
    </section>
  );
}
