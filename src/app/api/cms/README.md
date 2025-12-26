# Mini CMS - Documentation API

Ce mini CMS permet de gérer facilement :

- Les marques, leurs descriptions et leurs images
- Le contenu de la page d'accueil (titres, textes, etc.)
- Le contenu de la page Arpin
- Tous les textes éditables du site

## Endpoints API

### Marques (`/api/cms/marques`)

#### GET - Récupérer les marques

```bash
# Toutes les marques
GET /api/cms/marques

# Une marque spécifique
GET /api/cms/marques?nom=The North Face
```

#### POST - Créer une marque

```bash
POST /api/cms/marques
Content-Type: application/json

{
  "nom": "Nouvelle Marque",
  "description": "Description courte",
  "description_fr": "Description complète en français",
  "description_en": "Full description in English",
  "imageFolder": "/img/nouvelle-marque/",
  "type": "Type de produit"
}
```

#### PUT - Modifier une marque

```bash
PUT /api/cms/marques
Content-Type: application/json

{
  "nom": "The North Face",
  "description_fr": "Nouvelle description FR",
  "description_en": "New description EN",
  "type": "Nouveau type"
}
```

#### DELETE - Supprimer une marque

```bash
DELETE /api/cms/marques?nom=Marque à supprimer
```

### Images (`/api/cms/images`)

#### GET - Lister les images d'une marque

```bash
GET /api/cms/images?marque=The North Face
```

#### POST - Ajouter/Remplacer une image

```bash
POST /api/cms/images
Content-Type: multipart/form-data

FormData:
- file: (fichier image)
- marque: "The North Face"
- action: "add" | "replace" | "mainImage" | "logo"
- replaceIndex: 0 (optionnel, pour remplacer une image de la galerie)
```

Actions disponibles :

- `add` : Ajoute une image à la galerie
- `replace` : Remplace une image existante (nécessite replaceIndex)
- `mainImage` : Définit/remplace l'image principale
- `logo` : Définit/remplace le logo

#### DELETE - Supprimer une image

```bash
# Supprimer une image de la galerie
DELETE /api/cms/images?marque=The North Face&imageUrl=/img/Thenorthface/image.jpg&type=gallery

# Supprimer l'image principale
DELETE /api/cms/images?marque=The North Face&type=main

# Supprimer le logo
DELETE /api/cms/images?marque=The North Face&type=logo

# Supprimer toutes les images
DELETE /api/cms/images?marque=The North Face&type=all
```

## Utilisation depuis le frontend

### Exemple avec fetch

```javascript
// Récupérer toutes les marques
const marques = await fetch("/api/cms/marques").then((r) => r.json());

// Modifier une description
await fetch("/api/cms/marques", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nom: "UGG",
    description_fr: "Nouvelle description française",
  }),
});

// Upload d'une nouvelle image
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("marque", "UGG");
formData.append("action", "add");

await fetch("/api/cms/images", {
  method: "POST",
  body: formData,
});
```

### Contenu (`/api/cms/content`)

#### GET - Récupérer le contenu

```bash
# Tout le contenu
GET /api/cms/content

# Une section spécifique
GET /api/cms/content?section=homepage

# Une sous-section spécifique
GET /api/cms/content?section=homepage&subsection=hero
```

#### PUT - Modifier le contenu

```bash
PUT /api/cms/content
Content-Type: application/json

{
  "section": "homepage",
  "subsection": "introduction",
  "content": {
    "title": "Nouveau titre",
    "paragraph1": "Nouveau texte...",
    "paragraph2": "Autre texte..."
  }
}
```

## Page Admin

Une interface d'administration est disponible à `/admin` pour gérer facilement :

### Onglet Marques

- Les descriptions (FR/EN)
- Les types de produits
- Les logos
- Les images principales
- Les galeries d'images

### Onglet Contenu du Site

- **Page d'accueil** : Hero, Introduction, Équipe, Marques, etc.
- **Page Arpin** : Titre, descriptions, historique, catalogue, etc.
- Modification en temps réel de tous les textes

L'accès à l'admin est désormais protégé par authentification (username + mot de passe).
La page de connexion est disponible à `/login`.

Les requêtes en écriture (POST/PUT/DELETE) sur les endpoints CMS exigent une session valide.
