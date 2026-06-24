import type { Metadata } from "next";
import { LegalContent, LegalPage, LegalSection } from "@/components/LegalPage";
import { getContentBlock, getSiteSettings } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et traitement des données personnelles — Nivalis Les Gets.",
};

export const revalidate = 300;

export default async function ConfidentialitePage() {
  const [block, settings] = await Promise.all([
    getContentBlock("legal", "confidentialite"),
    getSiteSettings(),
  ]);

  const cmsTitle = typeof block.title === "string" ? block.title : undefined;
  const cmsContent = typeof block.content === "string" ? block.content : "";

  // Mode piloté par le CMS : un texte saisi en base remplace le contenu statique.
  if (cmsContent.trim()) {
    return (
      <LegalPage
        title={cmsTitle ?? "Politique de confidentialité"}
        updated="juin 2026"
      >
        <LegalContent content={cmsContent} />
      </LegalPage>
    );
  }

  // Mode statique : coordonnées issues des réglages, fallback sur les valeurs actuelles.
  const email = settings.contact?.email ?? "contact@nivalislesgets.com";

  return (
    <LegalPage title="Politique de confidentialité" updated="juin 2026">
      <LegalSection title="Données collectées">
        <p>
          Les seules données personnelles collectées sur ce site le sont via le
          formulaire de contact : nom, adresse e-mail et contenu du message.
          Aucune donnée n'est collectée à votre insu et le site n'utilise pas de
          cookies de suivi publicitaire.
        </p>
      </LegalSection>

      <LegalSection title="Finalité et base légale">
        <p>
          Ces informations sont utilisées uniquement pour répondre à votre
          demande. La base légale du traitement est votre consentement, exprimé
          lors de l'envoi du formulaire.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>
          Les messages sont acheminés par notre prestataire d'envoi d'e-mails
          (Resend) et ne sont transmis à aucun tiers à des fins commerciales.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les messages sont conservés le temps nécessaire au traitement de votre
          demande, puis archivés ou supprimés.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de
          rectification, d'effacement et d'opposition sur vos données. Pour
          l'exercer, écrivez-nous à {email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
