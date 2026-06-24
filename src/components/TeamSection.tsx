import { SafeImage } from "@/components/SafeImage";

interface TeamMember {
  name?: string;
  role?: string;
  description?: string;
  image?: string;
}

interface TeamContent {
  title?: string;
  description?: string;
  members?: TeamMember[];
}

export default function TeamSection({ content }: { content?: TeamContent }) {
  const title = content?.title || "Notre équipe";
  const description =
    content?.description ||
    "Des professionnels passionnés, toujours prêts à vous conseiller et vous accompagner dans vos choix.";
  const members = Array.isArray(content?.members) ? content!.members : [];

  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow">L'équipe</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {members.length === 0 ? (
          <div className="mt-16 flex min-h-48 items-center justify-center border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              L&apos;équipe sera présentée ici prochainement.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => {
              const name = member?.name?.trim() || "Membre";
              return (
                <article key={index} className="group">
                  <div className="img-zoom relative aspect-[3/4] overflow-hidden bg-muted">
                    <SafeImage
                      src={member?.image}
                      alt={`${name}${member?.role ? `, ${member.role}` : ""}`}
                      fill
                      fallbackLabel={name.charAt(0)}
                      className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-serif text-xl tracking-tight">{name}</h3>
                    {member?.role ? (
                      <p className="eyebrow mt-1.5">{member.role}</p>
                    ) : null}
                    {member?.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {member.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
