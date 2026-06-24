// Types partagés — source de vérité (DB Postgres : tables `marques`, `content_sections`)

export interface ProduitPhare {
  id?: string;
  nom: string;
  description: string;
  image: string;
  prix?: string;
}

export interface MarqueContact {
  adresse?: string;
  address?: string;
  telephone?: string;
  phone?: string;
  email?: string;
  horaires?: string;
}

export interface MarqueData {
  nom: string;
  /** Nom d'affichage soigné (accents, casse, espaces). Le `nom` reste l'identité/PK et la base du slug. */
  displayName?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  mainImage: string;
  logo: string;
  tags: string[];
  type: string;
  website?: string;
  histoire?: string;
  images?: string[];
  imageFolder?: string;
  videos?: string[];
  produits?: ProduitPhare[];
  contact?: MarqueContact;
}

export interface MarquesData {
  marques: MarqueData[];
}

// Contenu éditorial (content_sections) : section -> subsection -> contenu libre
export type ContentValue = Record<string, unknown>;
export type SectionContent = Record<string, ContentValue>;
export type SiteContent = Record<string, SectionContent>;

// ---------------------------------------------------------------------------
// Réglages du site (section content `site`) — source unique de vérité.
// Centralise ce qui était répété en dur dans Footer/contact/Introduction/Arpin/légal.
// ---------------------------------------------------------------------------
export interface SiteContactSettings {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapsEmbedUrl?: string;
  mapsLink?: string;
}

export interface SiteSocialSettings {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SiteBrandingSettings {
  name?: string;
  baseline?: string;
}

export interface SiteSeoSettings {
  defaultTitle?: string;
  titleTemplate?: string;
  description?: string;
  ogImage?: string;
}

export interface SiteSettings {
  contact?: SiteContactSettings;
  social?: SiteSocialSettings;
  branding?: SiteBrandingSettings;
  seo?: SiteSeoSettings;
}
