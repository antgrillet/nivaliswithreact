import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la boutique Nivalis aux Gets — adresse, téléphone, e-mail et formulaire.",
};

export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contact = settings.contact ?? {};

  const address = contact.address ?? "21 Rte du Front de Neige, 74260 Les Gets";
  const phone = contact.phone ?? "06 81 73 66 47";
  const email = contact.email ?? "contact@nivalislesgets.com";
  const hours = contact.hours ?? "Lun–Dim : 9h30 – 19h00";
  const mapsEmbedUrl =
    contact.mapsEmbedUrl ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5833857036487!2d6.710054600000001!3d46.1521957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c11d7b4eb2473%3A0x96bb0c34c1f9df2!2s21%20Rte%20du%20Front%20de%20Neige%2C%2074260%20Les%20Gets!5e0!3m2!1sfr!2sfr!4v1626345678901!5m2!1sfr!2sfr";

  // Lien `tel:` dérivé du téléphone affiché (chiffres uniquement, +33 si format FR).
  const phoneDigits = phone.replace(/[^\d]/g, "");
  const telHref = phoneDigits.startsWith("0")
    ? `tel:+33${phoneDigits.slice(1)}`
    : `tel:${phoneDigits}`;

  const coords = [
    { icon: MapPin, label: "Adresse", value: address },
    { icon: Phone, label: "Téléphone", value: phone, href: telHref },
    { icon: Mail, label: "E-mail", value: email, href: `mailto:${email}` },
    { icon: Clock, label: "Horaires", value: hours },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border px-6 pb-16 pt-36 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
              Parlons de votre projet
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Une question sur une marque, une disponibilité, un conseil ? Passez
              en boutique ou écrivez-nous, nous vous répondons rapidement.
            </p>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Nos coordonnées</p>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {coords.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="eyebrow">{label}</dt>
                      <dd className="mt-1.5 text-sm">
                        {href ? (
                          <a href={href} className="link-underline pb-0.5">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-10 aspect-[3/2] overflow-hidden border border-border">
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

            <div>
              <p className="eyebrow">Écrivez-nous</p>
              <h2 className="mt-2 font-serif text-2xl tracking-tight">
                Envoyez-nous un message
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
