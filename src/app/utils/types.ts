// Types et interfaces pour les données des marques

export interface MarqueData {
  /**
   * Nom de la marque
   */
  nom: string;

  /**
   * Description courte de la marque
   */
  description: string;

  /**
   * Description détaillée en français (optionnelle)
   */
  description_fr?: string;

  /**
   * Description détaillée en anglais (optionnelle)
   */
  description_en?: string;

  /**
   * Chemin vers l'image principale de la marque
   */
  mainImage: string;

  /**
   * Chemin vers le logo de la marque
   */
  logo: string;

  /**
   * Liste des tags associés à la marque
   */
  tags: string[];

  /**
   * Type ou catégorie de la marque
   */
  type: string;

  /**
   * Site web officiel de la marque (optionnel)
   */
  website?: string;

  /**
   * Histoire ou valeurs de la marque (optionnel)
   */
  histoire?: string;

  /**
   * Liste des chemins vers les images de la marque (optionnel)
   */
  images?: string[];

  /**
   * Dossier contenant les images de la marque (optionnel)
   */
  imageFolder?: string;

  /**
   * Liste des produits phares de la marque (optionnel)
   */
  produits?: {
    /**
     * Identifiant unique du produit (optionnel)
     */
    id?: string;

    /**
     * Nom du produit
     */
    nom: string;

    /**
     * Description du produit
     */
    description: string;

    /**
     * Chemin vers l'image du produit
     */
    image: string;

    /**
     * Prix du produit (optionnel)
     */
    prix?: string;
  }[];

  /**
   * Informations de contact de la marque (optionnel)
   */
  contact?: {
    /**
     * Adresse en français (optionnel)
     */
    adresse?: string;

    /**
     * Adresse en anglais (optionnel)
     */
    address?: string;

    /**
     * Numéro de téléphone en français (optionnel)
     */
    telephone?: string;

    /**
     * Numéro de téléphone en anglais (optionnel)
     */
    phone?: string;

    /**
     * Adresse email (optionnel)
     */
    email?: string;

    /**
     * Horaires d'ouverture (optionnel)
     */
    horaires?: string;
  };
}

// Structure des données complètes du fichier marque.json
export interface MarquesData {
  marques: MarqueData[];
}
