# CLAUDE.md

Guide pour travailler dans ce dépôt (Claude Code & co.).

## Commandes (Bun)

- `bun install` — dépendances
- `bun run dev` — serveur de dev (Turbopack)
- `bun run build` — build de production (TypeScript strict ; le build casse sur erreur TS)
- `bun run start` — serveur de production
- `bun run lint` — ESLint
- `bun add <pkg>` / `bun remove <pkg>` — gérer les dépendances
- `bun run migrate:blob` — migration one-shot des images locales vers Vercel Blob

> Bun est le gestionnaire de paquets de ce projet (`bun.lock`). Ne pas utiliser npm/pnpm.

## Vue d'ensemble

Site vitrine bilingue (FR/EN) **Nivalis** — boutique de marques premium outdoor aux Gets (marque phare : **Arpin**, lainage savoyard depuis 1817). Next.js 16 (App Router), rendu majoritairement en **Server Components**.

## Stack

- **Framework** : Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 (strict)
- **Style** : Tailwind CSS v4 (config dans `src/app/globals.css` via `@theme inline`), shadcn/ui (`src/components/ui/*`)
- **Auth** : Better Auth (plugin `username`, cookies Next) sur PostgreSQL
- **Base de données** : PostgreSQL via `pg` (`DATABASE_URL`)
- **Médias** : Vercel Blob (`@vercel/blob`)
- **E-mails** : Resend
- **Animations** : `motion` (anciennement framer-motion ; imports `motion/react`)
- **Back-office** : TanStack Query, React Hook Form, Zod
- **Icônes / toasts** : `lucide-react`, `sonner`

## Source de vérité : PostgreSQL

Les données vivent en base, **pas** dans des fichiers JSON (les anciens `src/data/*.json` ont été supprimés).

- Table `marques` : colonnes `nom` (PK), `description`, `description_fr`, `description_en`, `image_folder`, `main_image`, `logo`, `images[]`, `videos[]`, `tags[]`, `type`, `website`, `histoire`, `contact` (jsonb), `produits` (jsonb), `updated_at`.
- Table `content_sections` : (`section`, `subsection`, `content` jsonb, `updated_at`). Ex. section `homepage` → sous-sections `hero`, `introduction`, `team`, `brands`, `arpin`, `store`.
- Tables Better Auth (`user`, `session`, `account`…) gérées par la lib.

## Architecture data & rendu

- **Couche data serveur** (`src/lib/data/*`, `import "server-only"`) :
  - `marques.ts` : `getMarques`, `getMarqueByNom`, `getMarqueBySlug`, `getSimilarMarques` (cache `unstable_cache`, tag `"marques"`).
  - `content.ts` : `getAllContent`, `getContent(section)`, `getContentBlock(section, subsection)` (tag `"content"`).
- **Pages publiques = Server Components** qui lisent la couche data (plus de `fetch` client ni de polling). L'interactivité (carousel, filtres, galerie, formulaires) vit dans des **Client Components enfants** recevant les données en props.
- **Synchronisation admin → public** : les mutations CMS appellent `revalidateTag("marques" | "content", "max")` (signature à 2 args de Next 16). Les pages ont `export const revalidate = 300`.
- **Slug robuste** : `slugify()` dans `src/lib/slug.ts` (gère accents, casse, `&`, tirets). `/marques/[slug]` utilise `generateStaticParams` + `getMarqueBySlug`.
- **Images** : toujours via `src/components/SafeImage.tsx` (résout Blob/legacy via `src/utils/imageUtils.ts`, fallback intégré, option `fallbackClassName` pour les fonds sombres). `next.config.ts` a `images.unoptimized: true`.

## API (`src/app/api`)

- `cms/marques` — GET (public) ; POST/PUT/DELETE (auth) avec validation Zod (`src/lib/schemas/marque.ts`), `revalidateTag("marques")`, et **cascade `del()` des Blob** à la suppression.
- `cms/content` — GET (public) ; PUT/POST (auth), `revalidateTag("content")`.
- `cms/images`, `cms/content-images` — upload/suppression d'images liées aux données (auth, revalidation).
- `blob/upload` (auth via `onBeforeGenerateToken`), `blob/list` & `blob/delete` (auth). **Toutes protégées** (cf. sécurité).
- `contact` — Resend, validation Zod partagée (`src/lib/schemas/contact.ts`).
- `auth/[...all]`, `download`, `serve-image/[...path]`.

## Sécurité

- `src/proxy.ts` (middleware Next 16) protège `/admin` (redirige vers `/login`), `/api/cms` (sauf GET) et `/api/blob/(delete|list)`.
- Garde réutilisable : `getSessionUser()` dans `src/lib/auth-guard.ts` (défense en profondeur dans les routes Blob).
- `/api/blob/upload` n'est pas bloqué au proxy (handleUpload reçoit aussi un webhook signé Vercel) ; l'auth y est vérifiée dans `onBeforeGenerateToken`.

## Back-office (`/admin`)

Protégé par session. Architecture modulaire (fini le monolithe) :

- `src/app/admin/{layout,page,marques,contenu,mediatheque}` — layout = garde d'auth + `QueryProvider` + `AdminSidebar`.
- `src/components/admin/*` — `MarqueForm` (RHF + `zodResolver`), `MarquesTable`, `MarqueDeleteDialog`, `ContentEditor`/`ContentFields`, `MediaUploader`/`MediaLibrary`/`MediaPickerDialog`, `DashboardStats`.
- `src/hooks/admin/*` — TanStack Query (`useMarques`, `useMarqueMutations`, `useContent`, `useContentMutations`, `useBlobList`, `useBlobMutations`) : invalidation `invalidateQueries` (plus de polling), erreurs/succès via toasts `sonner` (plus d'`alert()`).
- Premier compte admin : `/login?setup=1` (si `DISABLE_SIGNUP` ≠ `true`).

## Direction artistique — « Galerie Monochrome »

Luxe minimal : **noir / ivoire**, typographie éditoriale, grille stricte, bordures fines, micro-interactions subtiles. Esprit Aesop / The Row.

- **Couleurs : via les tokens uniquement** (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-secondary`, `bg-muted`, `border-border`, et `bg-foreground text-background` pour les blocs sombres). **Aucune classe `amber-*`** ni couleur littérale en façade. `destructive` (rouge) réservé à l'admin.
- **Typo** : titres `font-serif` (Fraunces) `tracking-tight` ; labels via la classe `eyebrow` ; corps `font-sans` (Geist). Polices déclarées dans `src/app/layout.tsx`.
- **Classes utilitaires maison** (`globals.css`) : `eyebrow`, `link-underline`, `img-zoom`, `animate-fadeIn`, `animate-fadeSlideUp`. Pas d'animations décoratives lourdes.

## Variables d'environnement

`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `BETTER_AUTH_SECRET`, `DISABLE_SIGNUP`, `BETTER_AUTH_URL` (recommandé en prod). Pull depuis Vercel : `bunx vercel env pull .env.local`.
