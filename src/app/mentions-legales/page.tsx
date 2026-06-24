import type { Metadata } from "next";
import { LegalContent, LegalPage, LegalSection } from "@/components/LegalPage";
import { getContentBlock, getSiteSettings } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Nivalis Les Gets.",
};

export const revalidate = 300;

export default async function MentionsLegalesPage() {
  const [block, settings] = await Promise.all([
    getContentBlock("legal", "mentions"),
    getSiteSettings(),
  ]);

  const cmsTitle = typeof block.title === "string" ? block.title : undefined;
  const cmsContent = typeof block.content === "string" ? block.content : "";

  // Mode piloté par le CMS : un texte saisi en base remplace le contenu statique.
  if (cmsContent.trim()) {
    return (
      <LegalPage title={cmsTitle ?? "Mentions légales"} updated="juin 2026">
        <LegalContent content={cmsContent} />
      </LegalPage>
    );
  }

  // Mode statique : coordonnées issues des réglages, fallback sur les valeurs actuelles.
  const name = settings.branding?.name ?? "Nivalis";
  const address =
    settings.contact?.address ?? "21 Rte du Front de Neige, 74260 Les Gets, France";
  const phone = settings.contact?.phone ?? "06 81 73 66 47";
  const email = settings.contact?.email ?? "contact@nivalislesgets.com";

  return (
    <LegalPage title="Mentions légales" updated="juin 2026">
      <LegalSection title="Éditeur du site">
        <p>
          {name} — boutique de marques premium outdoor.
          <br />
          {address}
        </p>
        <p>
          Téléphone : {phone}
          <br />
          E-mail : {email}
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
          91789, États-Unis — vercel.com.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus présents sur ce site (textes, visuels, logos,
          identités de marques) est protégé par le droit de la propriété
          intellectuelle. Les marques et logos partenaires demeurent la
          propriété de leurs détenteurs respectifs. Toute reproduction sans
          autorisation est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          {name} s'efforce d'assurer l'exactitude des informations diffusées sur
          ce site, sans garantie d'exhaustivité. Les disponibilités et
          références produits sont à confirmer directement en boutique.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
