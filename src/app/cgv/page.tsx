import type { Metadata } from "next";
import { LegalContent, LegalPage, LegalSection } from "@/components/LegalPage";
import { getContentBlock, getSiteSettings } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Conditions générales",
  description: "Conditions générales de vente — Nivalis Les Gets.",
};

export const revalidate = 300;

export default async function CgvPage() {
  const [block, settings] = await Promise.all([
    getContentBlock("legal", "cgv"),
    getSiteSettings(),
  ]);

  const cmsTitle = typeof block.title === "string" ? block.title : undefined;
  const cmsContent = typeof block.content === "string" ? block.content : "";

  // Mode piloté par le CMS : un texte saisi en base remplace le contenu statique.
  if (cmsContent.trim()) {
    return (
      <LegalPage
        title={cmsTitle ?? "Conditions générales de vente"}
        updated="juin 2026"
      >
        <LegalContent content={cmsContent} />
      </LegalPage>
    );
  }

  // Mode statique : coordonnées issues des réglages, fallback sur les valeurs actuelles.
  const name = settings.branding?.name ?? "Nivalis";
  const phone = settings.contact?.phone ?? "06 81 73 66 47";
  const email = settings.contact?.email ?? "contact@nivalislesgets.com";

  return (
    <LegalPage title="Conditions générales de vente" updated="juin 2026">
      <LegalSection title="Préambule">
        <p>
          {name} est une boutique physique située aux Gets. Les ventes sont
          réalisées en magasin ; le présent site est une vitrine de présentation
          des marques et n'assure pas de vente en ligne.
        </p>
      </LegalSection>

      <LegalSection title="Produits et disponibilités">
        <p>
          Les visuels et descriptions présentés sont fournis à titre indicatif.
          Les références, tailles et disponibilités sont à confirmer directement
          en boutique ou par téléphone.
        </p>
      </LegalSection>

      <LegalSection title="Prix et paiement">
        <p>
          Les prix sont affichés en boutique, en euros et toutes taxes
          comprises. Le règlement s'effectue sur place selon les moyens de
          paiement acceptés en magasin.
        </p>
      </LegalSection>

      <LegalSection title="Réservations">
        <p>
          Toute réservation d'article convenue par téléphone ou via le
          formulaire de contact est valable pour la durée indiquée par nos
          équipes et reste soumise à disponibilité.
        </p>
      </LegalSection>

      <LegalSection title="Service client">
        <p>
          Pour toute question, contactez-nous au {phone} ou à {email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
