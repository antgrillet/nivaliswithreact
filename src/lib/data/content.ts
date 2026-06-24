import "server-only";
import { unstable_cache } from "next/cache";
import { query } from "@/lib/db";
import type {
  ContentValue,
  SectionContent,
  SiteContent,
  SiteSettings,
} from "@/lib/types";

interface ContentRow {
  section: string;
  subsection: string;
  content: ContentValue;
}

/** Tout le contenu éditorial, mis en cache et invalidé par le tag "content". */
export const getAllContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const { rows } = await query<ContentRow>(
      "SELECT section, subsection, content FROM content_sections"
    );
    const result: SiteContent = {};
    for (const row of rows) {
      (result[row.section] ??= {})[row.subsection] = row.content ?? {};
    }
    return result;
  },
  ["content-all"],
  { tags: ["content"], revalidate: 300 }
);

/** Contenu d'une section entière (ex : "homepage", "arpin"). */
export async function getContent(section: string): Promise<SectionContent> {
  const all = await getAllContent();
  return all[section] ?? {};
}

/** Contenu d'une sous-section précise (ex : section "homepage", subsection "hero"). */
export async function getContentBlock(
  section: string,
  subsection: string
): Promise<ContentValue> {
  const sectionContent = await getContent(section);
  return sectionContent[subsection] ?? {};
}

/**
 * Réglages du site (section `site`) — source unique de vérité pour les
 * coordonnées, réseaux sociaux, branding et SEO. Renvoie un objet vide par
 * sous-section absente : les composants appliquent leurs propres fallbacks.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const site = await getContent("site");
    return {
      contact: site.contact ?? {},
      social: site.social ?? {},
      branding: site.branding ?? {},
      seo: site.seo ?? {},
    } as SiteSettings;
  } catch {
    // Résilient : ne casse jamais le rendu, les composants appliquent leurs fallbacks.
    return { contact: {}, social: {}, branding: {}, seo: {} };
  }
}
