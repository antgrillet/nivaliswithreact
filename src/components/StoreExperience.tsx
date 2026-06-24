interface Testimonial {
  name: string;
  role: string;
  text: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Sophie M.",
    role: "Skieuse passionnée",
    text: "Une superbe boutique avec un accueil chaleureux. L'équipe m'a parfaitement conseillée pour mes vêtements de ski. Je recommande vivement.",
  },
  {
    name: "Thomas L.",
    role: "Randonneur",
    text: "J'ai trouvé exactement ce qu'il me fallait pour mes randonnées. Le service est impeccable et les conseils toujours pertinents.",
  },
  {
    name: "Emma D.",
    role: "En famille",
    text: "Parfait pour toute la famille. Les enfants ont adoré choisir leurs tenues et l'équipe a été très patiente avec nous.",
  },
];

export default function StoreExperience({
  content,
}: {
  content?: { title?: string; subtitle?: string; testimonials?: Testimonial[] };
}) {
  const testimonials =
    content?.testimonials && content.testimonials.length > 0
      ? content.testimonials
      : DEFAULT_TESTIMONIALS;

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow">Témoignages</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            {content?.title || "Ce que disent nos clients"}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col bg-background p-8 md:p-10">
              <blockquote className="flex-1 font-serif text-xl leading-relaxed tracking-tight text-foreground">
                « {t.text} »
              </blockquote>
              <figcaption className="mt-8 border-t border-border pt-5">
                <p className="font-medium">{t.name}</p>
                <p className="eyebrow mt-1">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
