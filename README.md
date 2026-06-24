# Nivalis

Site vitrine de **Nivalis** — boutique de marques premium outdoor aux Gets (marque phare : Arpin, lainage savoyard depuis 1817). Bilingue FR/EN, direction artistique « Galerie Monochrome ».

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Better Auth · PostgreSQL (`pg`) · Vercel Blob · Resend · TanStack Query · Zod. Gestionnaire de paquets : **Bun**.

## Démarrage

```bash
bun install
bunx vercel env pull .env.local   # récupère les variables depuis Vercel
bun run dev                       # http://localhost:3000
```

## Scripts

| Commande | Description |
| --- | --- |
| `bun run dev` | Serveur de développement (Turbopack) |
| `bun run build` | Build de production |
| `bun run start` | Serveur de production |
| `bun run lint` | ESLint |

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL (source de vérité) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (médias) |
| `RESEND_API_KEY` | Envoi des e-mails (formulaires) |
| `BETTER_AUTH_SECRET` | Secret de session Better Auth (≥ 32 caractères) |
| `BETTER_AUTH_URL` | URL publique (recommandé en prod) |
| `DISABLE_SIGNUP` | `true` pour désactiver la création de comptes |

## Back-office

Interface d'administration sur `/admin`, protégée par Better Auth (identifiant + mot de passe). Création du premier compte : `/login?setup=1` (puis passer `DISABLE_SIGNUP=true`).

## Documentation

Voir [`CLAUDE.md`](./CLAUDE.md) pour l'architecture détaillée (couche data, Server Components, sécurité, conventions de design).
