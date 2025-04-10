# API d'Images pour Nivalis

Ce dossier contient les API Next.js utilisées par le composant `ImageGallery` et autres fonctionnalités liées aux images dans l'application Nivalis.

## Endpoints disponibles

### GET /api/images

Récupère toutes les images d'un dossier spécifié (à l'exception des logos).

**Paramètres:**

- `folder` (obligatoire): Chemin du dossier d'images (à partir de `/public`)

**Exemple:**

```
/api/images?folder=/img/Arpin/
```

**Réponse:**

```json
{
  "images": [
    "/img/Arpin/image1.jpg",
    "/img/Arpin/image2.jpg",
    "/img/Arpin/image3.jpg"
  ],
  "folder": "/img/Arpin/",
  "count": 3
}
```

### GET /api/images/bulk

Récupère des images pour plusieurs marques en une seule requête (à l'exception des logos).

**Paramètres:**

- `brands` (optionnel): Liste de marques séparées par des virgules
- `limit` (optionnel): Nombre maximum d'images par marque (défaut: 3)

**Exemple:**

```
/api/images/bulk?brands=Arpin,Timberland&limit=2
```

**Réponse:**

```json
{
  "results": [
    {
      "name": "Arpin",
      "path": "/img/Arpin/",
      "images": ["/img/Arpin/image1.jpg", "/img/Arpin/image2.jpg"]
    },
    {
      "name": "Timberland",
      "path": "/img/Timberland/",
      "images": ["/img/Timberland/image1.jpg", "/img/Timberland/image2.jpg"]
    }
  ]
}
```

### GET /api/images/random

Récupère des images aléatoires d'une ou plusieurs marques (à l'exception des logos).

**Paramètres:**

- `brand` (optionnel): Marque spécifique
- `count` (optionnel): Nombre d'images à retourner (défaut: 5)

**Exemple pour une marque spécifique:**

```
/api/images/random?brand=Arpin&count=3
```

**Exemple pour toutes les marques:**

```
/api/images/random?count=6
```

**Réponse pour une marque spécifique:**

```json
{
  "brand": "Arpin",
  "images": [
    "/img/Arpin/image2.jpg",
    "/img/Arpin/image4.jpg",
    "/img/Arpin/image1.jpg"
  ]
}
```

**Réponse pour toutes les marques:**

```json
{
  "images": [
    {
      "brand": "Arpin",
      "image": "/img/Arpin/image1.jpg"
    },
    {
      "brand": "Timberland",
      "image": "/img/Timberland/image3.jpg"
    },
    {
      "brand": "Ugg",
      "image": "/img/Ugg/image2.jpg"
    }
  ]
}
```

### GET /api/images/test

Endpoint de test qui retourne des images simulées pour la galerie.

**Réponse:**

```json
{
  "status": "success",
  "folder": "/img/Arpin/",
  "images": [
    "/img/Arpin/image4.jpeg",
    "/img/Arpin/image003.jpg",
    "/img/Arpin/IMG_0253.jpg"
  ],
  "note": "Ceci est une API de test qui retourne des chemins d'images simulés pour le développement."
}
```

### GET /api/debug

Endpoint de débogage qui fournit des informations sur la structure des dossiers d'images.

**Réponse:**

```json
{
  "env": "development",
  "cwd": "/Users/username/projects/nivaliswithreact",
  "paths": {
    "publicDir": "/Users/username/projects/nivaliswithreact/public",
    "imgDir": "/Users/username/projects/nivaliswithreact/public/img",
    "publicExists": true,
    "imgExists": true
  },
  "brandFolders": [
    {
      "name": "Arpin",
      "path": "/img/Arpin/",
      "exists": true,
      "imageCount": 5
    },
    ...
  ]
}
```

## Utilisation avec le composant ImageGallery

Le composant `ImageGallery` utilise principalement l'endpoint `/api/images` pour récupérer les images à afficher. Il peut être utilisé de la manière suivante:

```jsx
<ImageGallery imageFolderPath="/img/Arpin/" marqueNom="Arpin" />
```

## Filtrage des images

Toutes les API qui servent des images intègrent les fonctionnalités suivantes:

- Filtrage par extensions d'image (jpg, jpeg, png, gif, webp, svg, avif, bmp)
- Exclusion automatique des fichiers contenant le mot "logo" dans leur nom
- Tri alphabétique des résultats

## Gestion des erreurs

Toutes les API gèrent les cas d'erreur communs et retournent des réponses JSON avec des codes HTTP appropriés:

- 400: Paramètre manquant ou invalide
- 403: Accès refusé au chemin spécifié
- 404: Dossier ou ressource non trouvé
- 500: Erreur serveur interne
