import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 pb-28 pt-36 lg:px-10">
        <p className="eyebrow">Informations légales</p>
        <h1 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-3 text-sm text-muted-foreground">
            Dernière mise à jour : {updated}
          </p>
        )}
        <div className="mt-12 max-w-2xl space-y-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}

/**
 * Rend un texte long saisi dans le CMS : chaque ligne non vide devient un
 * paragraphe, en préservant les sauts de ligne via `whitespace-pre-line`.
 */
export function LegalContent({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
