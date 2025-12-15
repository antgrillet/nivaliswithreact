# Plan de Migration vers Vercel Blob Storage

## Sommaire

1. [Analyse du Systeme Actuel](#1-analyse-du-système-actuel)
2. [Architecture Cible avec Vercel Blob](#2-architecture-cible-avec-vercel-blob)
3. [Plan de Migration Detaille](#3-plan-de-migration-détaillé)
4. [Modifications par Fichier](#4-modifications-par-fichier)
5. [Bonnes Pratiques et Securite](#5-bonnes-pratiques-et-sécurité)
6. [Migration des Donnees Existantes](#6-migration-des-données-existantes)
7. [Tests et Validation](#7-tests-et-validation)

---

## 1. Analyse du Systeme Actuel

### Architecture Actuelle (File-based)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Admin UI      │────▶│  API Routes      │────▶│  Fichiers Locaux    │
│  /admin         │     │  /api/cms/*      │     │  /src/data/*.json   │
└─────────────────┘     └──────────────────┘     │  /public/img/*      │
                                                 └─────────────────────┘
```

### Problemes Identifies

| Probleme | Impact | Solution Vercel Blob |
|----------|--------|---------------------|
| Fichiers locaux perdus a chaque deploy | Critique | Stockage persistant cloud |
| Pas de CDN pour les images | Performance | CDN automatique Vercel |
| Timestamps manuels pour cache-busting | Complexite | URLs uniques automatiques |
| Pas de redimensionnement | Performance | Integration possible avec next/image |
| Lecture/ecriture fichiers synchrone | Scalabilite | API async performante |
| Orphelins fichiers non geres | Maintenance | Gestion centralisee |

### Fichiers Impactes

```
src/
├── app/
│   ├── admin/page.tsx              # UI admin complete
│   └── api/
│       ├── cms/
│       │   ├── marques/route.ts    # CRUD marques (JSON)
│       │   ├── images/route.ts     # Upload/delete images locales
│       │   ├── content/route.ts    # CRUD contenu (JSON)
│       │   └── content-images/route.ts  # Upload images contenu
│       └── serve-image/[...path]/route.ts  # Serving images uploadees
├── utils/
│   └── imageUtils.ts               # Utilitaires images (a supprimer/simplifier)
└── data/
    ├── marque.json                 # Donnees marques
    └── content.json                # Contenu pages
```

---

## 2. Architecture Cible avec Vercel Blob

### Nouvelle Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Admin UI      │────▶│  API Routes      │────▶│  Vercel Blob        │
│  /admin         │     │  /api/cms/*      │     │  (Images)           │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
        │                       │                         │
        │                       ▼                         │
        │               ┌──────────────────┐              │
        │               │  Vercel KV/JSON  │              │
        │               │  (Donnees)       │              │
        │               └──────────────────┘              │
        │                                                 │
        └─────────────────────────────────────────────────┘
                              CDN Global
```

### Avantages Vercel Blob

- **Persistance**: Fichiers conserves entre deployments
- **CDN Global**: Distribution automatique worldwide
- **URLs Uniques**: Suffixes aleatoires automatiques (plus de timestamps)
- **API Simple**: `put`, `del`, `list`, `head`
- **Client Upload**: Upload direct navigateur -> Blob (bypass serveur)
- **Securite**: Tokens, validation MIME types, taille max

---

## 3. Plan de Migration Detaille

### Phase 1: Setup Initial

#### 1.1 Installation des dependances

```bash
pnpm add @vercel/blob
```

#### 1.2 Configuration environnement

```env
# .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

#### 1.3 Configuration Next.js

```typescript
// next.config.ts - Ajouter le domaine Blob
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
    // Garder unoptimized: false maintenant (optimisation possible)
  },
}
```

---

### Phase 2: Nouvelles API Routes

#### 2.1 Upload Handler (Client Upload Pattern)

**Fichier: `src/app/api/blob/upload/route.ts`**

```typescript
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Validation et autorisation
        // clientPayload contient: { marque, type, action }
        const payload = clientPayload ? JSON.parse(clientPayload) : {};

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/svg+xml',
            'image/gif',
            'image/avif',
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB max
          addRandomSuffix: true, // Remplace les timestamps manuels
          tokenPayload: JSON.stringify(payload),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback apres upload reussi
        console.log('Upload completed:', blob.url);

        // Optionnel: mettre a jour la BDD/JSON avec la nouvelle URL
        if (tokenPayload) {
          const payload = JSON.parse(tokenPayload);
          // await updateMarqueImage(payload.marque, payload.type, blob.url);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
```

#### 2.2 Delete Handler

**Fichier: `src/app/api/blob/delete/route.ts`**

```typescript
import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ success: true, deleted: url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Suppression multiple
export async function POST(request: Request) {
  const { urls } = await request.json();

  if (!urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: 'URLs array required' }, { status: 400 });
  }

  try {
    await del(urls);
    return NextResponse.json({ success: true, deleted: urls });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

#### 2.3 List Handler

**Fichier: `src/app/api/blob/list/route.ts`**

```typescript
import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';
  const limit = parseInt(searchParams.get('limit') || '100');
  const cursor = searchParams.get('cursor') || undefined;

  try {
    const result = await list({
      prefix,
      limit,
      cursor,
    });

    return NextResponse.json({
      blobs: result.blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
      hasMore: result.hasMore,
      cursor: result.cursor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

---

### Phase 3: Refactoring API CMS

#### 3.1 Nouvelle route images avec Vercel Blob

**Fichier: `src/app/api/cms/images/route.ts` (refactored)**

```typescript
import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/marque.json');

// Helper pour lire/ecrire JSON (temporaire, a migrer vers KV)
function readMarques() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeMarques(data: any) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST - Upload image vers Vercel Blob
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const marque = formData.get('marque') as string;
  const action = formData.get('action') as string; // logo, mainImage, add, replace
  const replaceIndex = formData.get('replaceIndex');

  if (!file || !marque || !action) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // Upload vers Vercel Blob
    const blob = await put(
      `marques/${marque}/${action}/${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    );

    // Mettre a jour le JSON
    const data = readMarques();
    const marqueIndex = data.marques.findIndex((m: any) => m.nom === marque);

    if (marqueIndex === -1) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const marqueData = data.marques[marqueIndex];
    let oldUrl: string | null = null;

    switch (action) {
      case 'logo':
        oldUrl = marqueData.logo;
        marqueData.logo = blob.url;
        break;
      case 'mainImage':
        oldUrl = marqueData.mainImage;
        marqueData.mainImage = blob.url;
        break;
      case 'add':
        if (!marqueData.images) marqueData.images = [];
        marqueData.images.push(blob.url);
        break;
      case 'replace':
        const idx = parseInt(replaceIndex as string);
        if (marqueData.images && marqueData.images[idx]) {
          oldUrl = marqueData.images[idx];
          marqueData.images[idx] = blob.url;
        }
        break;
    }

    // Supprimer l'ancienne image si elle existe sur Vercel Blob
    if (oldUrl && oldUrl.includes('blob.vercel-storage.com')) {
      try {
        await del(oldUrl);
      } catch (e) {
        console.warn('Could not delete old blob:', oldUrl);
      }
    }

    writeMarques(data);

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer image de Vercel Blob
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const marque = searchParams.get('marque');
  const imageUrl = searchParams.get('imageUrl');
  const type = searchParams.get('type'); // gallery, main, logo

  if (!marque || !imageUrl || !type) {
    return NextResponse.json(
      { error: 'Missing required params' },
      { status: 400 }
    );
  }

  try {
    // Supprimer de Vercel Blob si c'est une URL Blob
    if (imageUrl.includes('blob.vercel-storage.com')) {
      await del(imageUrl);
    }

    // Mettre a jour le JSON
    const data = readMarques();
    const marqueIndex = data.marques.findIndex((m: any) => m.nom === marque);

    if (marqueIndex === -1) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const marqueData = data.marques[marqueIndex];

    switch (type) {
      case 'gallery':
        marqueData.images = marqueData.images?.filter((img: string) => img !== imageUrl) || [];
        break;
      case 'main':
        marqueData.mainImage = '';
        break;
      case 'logo':
        marqueData.logo = '';
        break;
    }

    writeMarques(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - Lister images d'une marque
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marque = searchParams.get('marque');

  if (!marque) {
    return NextResponse.json({ error: 'Marque required' }, { status: 400 });
  }

  try {
    // Lister depuis Vercel Blob avec prefix
    const result = await list({
      prefix: `marques/${marque}/`,
    });

    return NextResponse.json({
      marque,
      blobs: result.blobs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

---

### Phase 4: Refactoring Admin UI

#### 4.1 Nouveau composant d'upload avec Client Upload

**Fichier: `src/components/admin/BlobImageUpload.tsx`**

```typescript
'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

interface BlobImageUploadProps {
  marque: string;
  type: 'logo' | 'mainImage' | 'gallery';
  onUploadComplete: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // en MB
}

export function BlobImageUpload({
  marque,
  type,
  onUploadComplete,
  onError,
  accept = 'image/*',
  maxSize = 10,
}: BlobImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation taille
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(new Error(`Fichier trop volumineux (max ${maxSize}MB)`));
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const blob = await upload(
        `marques/${marque}/${type}/${file.name}`,
        file,
        {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
          clientPayload: JSON.stringify({ marque, type }),
          onUploadProgress: ({ percentage }) => {
            setProgress(percentage);
          },
        }
      );

      onUploadComplete(blob.url);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id={`upload-${marque}-${type}`}
      />
      <label
        htmlFor={`upload-${marque}-${type}`}
        className={`
          cursor-pointer inline-flex items-center gap-2 px-4 py-2
          bg-blue-600 text-white rounded-lg hover:bg-blue-700
          transition-colors disabled:opacity-50
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {uploading ? (
          <>
            <span className="animate-spin">⏳</span>
            Upload... {progress}%
          </>
        ) : (
          <>
            <span>📤</span>
            Choisir une image
          </>
        )}
      </label>

      {uploading && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

#### 4.2 Modifications dans admin/page.tsx

```typescript
// Remplacer les appels fetch FormData par le composant BlobImageUpload

// AVANT (actuel):
const uploadImage = async (file: File, action: string, replaceIndex?: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("marque", selectedMarque.nom);
  formData.append("action", action);
  // ...
  const res = await fetch("/api/cms/images", { method: "POST", body: formData });
}

// APRES (avec Vercel Blob):
import { BlobImageUpload } from '@/components/admin/BlobImageUpload';

// Dans le JSX:
<BlobImageUpload
  marque={selectedMarque.nom}
  type="logo"
  onUploadComplete={(url) => {
    // Mettre a jour l'etat local
    setSelectedMarque(prev => ({ ...prev, logo: url }));
    // Sauvegarder dans JSON via API
    updateMarqueField('logo', url);
  }}
  onError={(error) => toast.error(error.message)}
/>
```

---

### Phase 5: Simplification imageUtils.ts

**Fichier: `src/utils/imageUtils.ts` (simplifie)**

```typescript
/**
 * Utilitaires images pour Vercel Blob
 *
 * Avec Vercel Blob, les URLs sont directement utilisables:
 * - CDN automatique
 * - Cache optimise
 * - Pas besoin de cache-busting manuel
 */

/**
 * Determine si une URL est une URL Vercel Blob
 */
export function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

/**
 * Determine si une URL est une image locale legacy
 */
export function isLocalImage(url: string): boolean {
  return url.startsWith('/img/') || url.startsWith('img/');
}

/**
 * Retourne l'URL appropriee pour affichage
 * - URLs Blob: utilisation directe
 * - URLs locales legacy: prefixe si necessaire
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // URLs Blob deja completes
  if (isBlobUrl(imagePath)) {
    return imagePath;
  }

  // URLs locales legacy
  if (isLocalImage(imagePath)) {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  // URLs externes
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return imagePath;
}

/**
 * Pour l'admin: ajoute cache-busting uniquement aux images locales
 * Les URLs Blob n'en ont pas besoin (suffixe aleatoire)
 */
export function getImageUrlWithCacheBusting(imagePath: string): string {
  if (!imagePath) return '';

  // Pas de cache-busting pour Blob (deja unique)
  if (isBlobUrl(imagePath)) {
    return imagePath;
  }

  // Cache-busting pour images locales legacy
  const baseUrl = getImageUrl(imagePath);
  return `${baseUrl}?t=${Date.now()}`;
}
```

---

### Phase 6: Suppression des routes obsoletes

**Routes a supprimer:**

```
src/app/api/serve-image/[...path]/route.ts  # Plus necessaire avec URLs Blob directes
```

**Routes a modifier:**

```
src/app/api/cms/images/route.ts      # Refactore pour Vercel Blob
src/app/api/cms/content-images/route.ts  # Refactore pour Vercel Blob
```

---

## 4. Modifications par Fichier

### Tableau Recapitulatif

| Fichier | Action | Description |
|---------|--------|-------------|
| `package.json` | Modifier | Ajouter `@vercel/blob` |
| `.env.local` | Creer | Ajouter `BLOB_READ_WRITE_TOKEN` |
| `next.config.ts` | Modifier | Ajouter domaines Blob dans images.remotePatterns |
| `src/app/api/blob/upload/route.ts` | Creer | Handler client upload |
| `src/app/api/blob/delete/route.ts` | Creer | Handler suppression |
| `src/app/api/blob/list/route.ts` | Creer | Handler listing |
| `src/app/api/cms/images/route.ts` | Refactorer | Utiliser Vercel Blob |
| `src/app/api/cms/content-images/route.ts` | Refactorer | Utiliser Vercel Blob |
| `src/app/api/serve-image/[...path]/route.ts` | Supprimer | Plus necessaire |
| `src/utils/imageUtils.ts` | Simplifier | Adapter pour URLs Blob |
| `src/components/admin/BlobImageUpload.tsx` | Creer | Composant upload |
| `src/app/admin/page.tsx` | Modifier | Utiliser nouveau composant |
| `CLAUDE.md` | Modifier | Documenter nouvelle architecture |

---

## 5. Bonnes Pratiques et Securite

### 5.1 Validation des uploads

```typescript
// Dans onBeforeGenerateToken:
return {
  // Types MIME autorises explicitement
  allowedContentTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
  ],
  // Taille maximale (10MB)
  maximumSizeInBytes: 10 * 1024 * 1024,
  // Suffixe aleatoire obligatoire
  addRandomSuffix: true,
  // Cache 1 an (images immuables avec suffixe)
  cacheControlMaxAge: 31536000,
};
```

### 5.2 Organisation des blobs

```
marques/
├── The North Face/
│   ├── logo/
│   │   └── logo-abc123.svg
│   ├── mainImage/
│   │   └── hero-xyz789.jpg
│   └── gallery/
│       ├── image1-def456.jpg
│       └── image2-ghi012.jpg
├── UGG/
│   └── ...
content/
├── homepage/
│   └── team/
│       └── photo1-jkl345.jpg
└── arpin/
    └── ...
```

### 5.3 Gestion des erreurs

```typescript
try {
  const blob = await put(pathname, file, options);
} catch (error) {
  if (error instanceof BlobAccessError) {
    // Token invalide ou expire
  } else if (error instanceof BlobStorageError) {
    // Erreur stockage (quota, etc.)
  } else {
    // Autre erreur
  }
}
```

### 5.4 Authentification (si necessaire)

```typescript
// Dans onBeforeGenerateToken, ajouter verification auth:
onBeforeGenerateToken: async (pathname, clientPayload) => {
  // Verifier session/token utilisateur
  // const session = await getServerSession();
  // if (!session) throw new Error('Unauthorized');

  return { /* ... */ };
},
```

---

## 6. Migration des Donnees Existantes

### 6.1 Script de migration

**Fichier: `scripts/migrate-to-blob.ts`**

```typescript
import { put } from '@vercel/blob';
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

const PUBLIC_IMG_DIR = path.join(process.cwd(), 'public/img');

interface MigrationResult {
  oldPath: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

async function migrateImage(
  localPath: string,
  blobPath: string
): Promise<MigrationResult> {
  try {
    const fileBuffer = readFileSync(localPath);
    const file = new Blob([fileBuffer]);

    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return {
      oldPath: localPath,
      newUrl: blob.url,
      success: true,
    };
  } catch (error) {
    return {
      oldPath: localPath,
      newUrl: '',
      success: false,
      error: (error as Error).message,
    };
  }
}

async function migrateAllImages() {
  const results: MigrationResult[] = [];
  const urlMapping: Record<string, string> = {};

  // Parcourir tous les dossiers de marques
  const brands = readdirSync(PUBLIC_IMG_DIR);

  for (const brand of brands) {
    const brandDir = path.join(PUBLIC_IMG_DIR, brand);
    if (!statSync(brandDir).isDirectory()) continue;

    const files = readdirSync(brandDir);

    for (const file of files) {
      const localPath = path.join(brandDir, file);
      if (!statSync(localPath).isFile()) continue;

      // Determiner le type (logo, mainImage, gallery)
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
        continue;
      }

      const blobPath = `marques/${brand}/gallery/${file}`;
      const result = await migrateImage(localPath, blobPath);

      results.push(result);

      if (result.success) {
        const oldUrl = `/img/${brand}/${file}`;
        urlMapping[oldUrl] = result.newUrl;
        console.log(`✅ Migrated: ${oldUrl} -> ${result.newUrl}`);
      } else {
        console.log(`❌ Failed: ${localPath} - ${result.error}`);
      }
    }
  }

  // Sauvegarder le mapping pour mise a jour JSON
  writeFileSync(
    'url-mapping.json',
    JSON.stringify(urlMapping, null, 2)
  );

  console.log(`\nMigration complete: ${results.filter(r => r.success).length}/${results.length} files`);
  return { results, urlMapping };
}

// Mise a jour des fichiers JSON avec nouvelles URLs
async function updateJsonFiles(urlMapping: Record<string, string>) {
  // Marques
  const marquesPath = path.join(process.cwd(), 'src/data/marque.json');
  let marquesData = JSON.parse(readFileSync(marquesPath, 'utf-8'));

  for (const marque of marquesData.marques) {
    // Logo
    if (marque.logo && urlMapping[marque.logo]) {
      marque.logo = urlMapping[marque.logo];
    }
    // Main image
    if (marque.mainImage && urlMapping[marque.mainImage]) {
      marque.mainImage = urlMapping[marque.mainImage];
    }
    // Gallery
    if (marque.images) {
      marque.images = marque.images.map((img: string) =>
        urlMapping[img] || img
      );
    }
  }

  writeFileSync(marquesPath, JSON.stringify(marquesData, null, 2));
  console.log('✅ Updated marque.json');

  // Content
  const contentPath = path.join(process.cwd(), 'src/data/content.json');
  let contentData = JSON.parse(readFileSync(contentPath, 'utf-8'));

  // Remplacer recursivement les URLs
  const replaceUrls = (obj: any): any => {
    if (typeof obj === 'string') {
      return urlMapping[obj] || obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceUrls);
    }
    if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = replaceUrls(value);
      }
      return newObj;
    }
    return obj;
  };

  contentData = replaceUrls(contentData);
  writeFileSync(contentPath, JSON.stringify(contentData, null, 2));
  console.log('✅ Updated content.json');
}

// Executer
migrateAllImages().then(({ urlMapping }) => {
  updateJsonFiles(urlMapping);
});
```

### 6.2 Commande npm

```json
// package.json
{
  "scripts": {
    "migrate:blob": "npx tsx scripts/migrate-to-blob.ts"
  }
}
```

### 6.3 Strategie de rollback

1. Conserver les images locales dans `/public/img/` pendant 2 semaines
2. Garder le fichier `url-mapping.json` comme reference
3. Si probleme: restaurer l'ancien JSON depuis git

---

## 7. Tests et Validation

### 7.1 Checklist de validation

- [ ] Upload logo fonctionne
- [ ] Upload image principale fonctionne
- [ ] Upload galerie (ajout) fonctionne
- [ ] Upload galerie (remplacement) fonctionne
- [ ] Suppression logo fonctionne
- [ ] Suppression image principale fonctionne
- [ ] Suppression image galerie fonctionne
- [ ] Affichage correct sur pages publiques
- [ ] Affichage correct dans admin
- [ ] next/image optimise les images Blob
- [ ] Progress bar upload fonctionne
- [ ] Validation type MIME fonctionne
- [ ] Validation taille fichier fonctionne
- [ ] Migration donnees existantes reussie

### 7.2 Tests manuels

```bash
# 1. Tester upload
curl -X POST http://localhost:3000/api/blob/upload \
  -H "Content-Type: application/json" \
  -d '{"pathname": "test/image.jpg", ...}'

# 2. Tester liste
curl http://localhost:3000/api/blob/list?prefix=marques/

# 3. Tester suppression
curl -X DELETE "http://localhost:3000/api/blob/delete?url=https://..."
```

### 7.3 Monitoring

- Verifier l'utilisation dans le dashboard Vercel Storage
- Surveiller les quotas (5GB gratuit, 100GB Pro)
- Verifier les temps de reponse CDN

---

## Resume des Commandes

```bash
# 1. Installation
pnpm add @vercel/blob

# 2. Configuration .env.local
echo "BLOB_READ_WRITE_TOKEN=your_token_here" >> .env.local

# 3. Migration des donnees
pnpm run migrate:blob

# 4. Test
pnpm dev

# 5. Deploy
git add .
git commit -m "feat: migrate to Vercel Blob Storage"
vercel deploy
```

---

## Estimation du Travail

| Phase | Complexite | Temps estime |
|-------|-----------|--------------|
| Phase 1: Setup | Faible | 30 min |
| Phase 2: API Routes | Moyenne | 2h |
| Phase 3: Refactoring CMS | Haute | 3h |
| Phase 4: Admin UI | Moyenne | 2h |
| Phase 5: Simplification | Faible | 30 min |
| Phase 6: Migration donnees | Moyenne | 1h |
| Phase 7: Tests | Moyenne | 1h |
| **Total** | | **~10h** |

---

## Questions Ouvertes

1. **Donnees JSON**: Migrer aussi vers Vercel KV ou garder fichiers locaux?
   - Recommandation: Garder JSON local pour l'instant, migrer vers KV dans une phase 2

2. **Authentification admin**: Ajouter une protection?
   - Recommandation: Oui, avec NextAuth.js ou Vercel Authentication

3. **Quotas**: Le plan gratuit (5GB) est-il suffisant?
   - A evaluer selon le nombre d'images (actuellement ~50-100)

4. **Images legacy**: Supprimer de /public/img/ apres migration?
   - Recommandation: Conserver 2 semaines puis supprimer
