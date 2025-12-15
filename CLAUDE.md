# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: Always use pnpm for package management in this project**

- `pnpm dev` - Start development server with Turbopack (http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks (disabled during builds but should be run manually)
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new package

## Project Architecture

This is a Next.js 15 application using the App Router architecture for a fashion/retail brand showcase website called "Nivalis". The application presents multiple fashion brands with images, descriptions, and product catalogs in both French and English.

### Key Directories

- **`src/app/`** - Next.js App Router pages and API routes
  - `page.tsx` - Homepage with hero section, brand showcase, team section
  - `marques/page.tsx` - Brand listing page with filtering
  - `marques/[slug]/page.tsx` - Dynamic brand detail pages
  - `marques/arpin/page.tsx` - Custom Arpin brand page with catalog download
  - `admin/page.tsx` - Admin panel for content management
  - `contact/page.tsx` - Contact page
  - `api/` - API routes (see API Architecture section below)
- **`src/components/`** - Reusable React components
  - `marques/` - Brand-specific components (filtering, lists, statistics)
  - `ui/` - Radix UI components (buttons, cards, inputs, labels, selects, hover-cards)
  - Core components: Navbar, Footer, HeroSection, ImageGallery, BrandCard, etc.
- **`src/data/`** - JSON data files (source of truth)
  - `marque.json` - Brand data with bilingual descriptions, images, tags, types
  - `content.json` - Site content data (homepage, team, etc.)
- **`src/utils/`** - Utility functions
  - `imageUtils.ts` - Image URL handling, cache-busting, uploaded image detection
- **`public/img/`** - Static image assets organized by brand folders (e.g., `/img/Arpin/`, `/img/Ugg/`)

### API Architecture

The application uses a dual data access pattern:

**Public Pages** - Fetch data dynamically via API:
- Homepage, brand listing, and brand detail pages all use `fetch('/api/cms/marques')`
- This ensures real-time synchronization with admin panel changes
- No static imports of JSON files to avoid stale data

**Admin Panel** - Directly modifies JSON files:
- All changes write to `src/data/marque.json` and `src/data/content.json`
- Auto-refresh every 5 seconds to stay synchronized

**API Endpoints:**
- `/api/cms/marques` - GET/POST/PUT/DELETE - Manage brand data (CRUD operations)
- `/api/cms/images` - POST/DELETE - Upload and delete brand images (logo, mainImage, gallery)
- `/api/cms/content` - GET/POST - Manage site content (homepage, Arpin page, team)
- `/api/cms/content-images` - POST/DELETE - Upload and delete content images
- `/api/images` - GET - Fetch images from specific brand folders
- `/api/images/bulk` - GET - Batch image retrieval for multiple brands
- `/api/images/random` - GET - Random image selection
- `/api/download` - GET - Handle file downloads (PDFs, catalogs)
- `/api/serve-image/[...path]` - GET - Serve dynamically uploaded images with proper headers

See `src/app/api/README.md` and `src/app/api/cms/README.md` for detailed endpoint documentation.

### Data Structure

Brand data is stored in `src/data/marque.json`:
```typescript
{
  "nom": string,                    // Brand name (used as identifier)
  "description": string,            // Short description
  "description_fr": string,         // Full French description
  "description_en": string,         // Full English description
  "imageFolder": string,            // Path like "/img/BrandName/"
  "mainImage": string,              // Hero image path
  "logo": string,                   // Logo path (SVG or PNG)
  "images": string[],               // Gallery images
  "videos": string[],               // Optional video files
  "tags": string[],                 // Categories like "Fashion", "Home", "Sport"
  "type": string                    // Product type description
}
```

Images are organized in `/public/img/[BrandName]/` directories. Dynamically uploaded images (via admin) are prefixed with timestamps (e.g., `1752770423550-image.jpg`).

### Technology Stack

- **Framework**: Next.js 15 with App Router (React 19)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI primitives (@radix-ui/react-dialog, hover-card, label, select, slot)
- **UI Utilities**: class-variance-authority, clsx, tailwind-merge, tw-animate-css
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Fonts**: Work Sans, Playfair Display (via next/font)
- **Notifications**: Sonner for toast messages
- **Utilities**: lodash.debounce for input debouncing

### Critical Configuration Details

**Image Handling** (`next.config.ts`):
- `unoptimized: true` - Disables Next.js image optimization to support dynamic admin uploads
- Images with timestamps (e.g., `1752770423550-image.jpg`) served via `/api/serve-image/[...path]`
- Static images served directly from `/img/` with `max-age=0, must-revalidate` headers
- SVG images allowed with security policies
- Use `getImageUrl()` from `imageUtils.ts` to get correct image URLs

**Build Configuration**:
- ESLint disabled during builds (`ignoreDuringBuilds: true`) but should be run with `pnpm lint`
- TypeScript errors still fail builds (`ignoreBuildErrors: false`)
- Turbopack enabled in dev mode (`--turbopack` flag)
- Path alias: `@/*` maps to `./src/*`

**Static File Headers** (configured in `next.config.ts`):
- PDF files: `Content-Disposition: attachment` for downloads
- `/img/*` directory: No caching to support dynamic uploads
- Image formats: AVIF and WebP supported

### Admin Panel (`/admin`)

Complete content management system accessible at `/admin` with no authentication (internal tool).

**Features:**
- Two-tab interface: "Marques" and "Contenu du Site"
- Auto-refresh every 5 seconds to stay synchronized
- Real-time updates reflected immediately on public pages

**Brand Management Tab:**
- Create, update, and delete brands
- Edit bilingual descriptions (French/English), types, and tags
- Upload/replace/delete brand logos, main images, and gallery images
- Drag & drop image uploads with preview
- Images timestamped on upload (e.g., `1752770423550-image.jpg`)

**Site Content Tab:**
- Edit homepage sections (hero, introduction, team, etc.)
- Edit Arpin page content
- Manage team member information
- Upload and manage content images

**Important Implementation Details:**
- All changes write directly to JSON files in `src/data/`
- Uses `getImageUrlWithCacheBusting()` from `imageUtils.ts` for image display
- Uploaded images are timestamped to avoid naming conflicts
- Image deletions also remove physical files from `/public/img/` directories

### Image Upload System

**Key Concept:** The app distinguishes between static and dynamically uploaded images.

**Static Images:**
- Original images committed to the repo
- Served directly from `/img/` paths
- Example: `/img/Arpin/image4.jpeg`

**Dynamically Uploaded Images (via admin):**
- Prefixed with 13-digit timestamp: `1752770423550-filename.jpg`
- Detection: `isUploadedImage()` in `imageUtils.ts` checks for `^\d{13}-` pattern
- Serving: Routed through `/api/serve-image/[...path]` for proper headers
- URL Generation: Use `getImageUrl()` which automatically routes timestamped images to API

**Cache Busting:**
- Admin uses `getImageUrlWithCacheBusting()` to append `?t=${Date.now()}`
- Public pages use `getImageUrl()` without cache-busting
- `/img/*` directory has `max-age=0, must-revalidate` headers

### Routing and Pages

**Dynamic Routing:**
- `/marques/[slug]` - Converts slug to brand name (e.g., `the-north-face` → `The North Face`)
- Slug matching is case-insensitive with space/dash normalization
- 404 returned if brand not found

**Special Pages:**
- `/marques/arpin` - Custom page with PDF catalog download functionality
- PDF served via `/api/download` route with proper `Content-Disposition` headers

**Navigation:**
- Navbar component used across all pages
- Footer component with brand information
- Responsive design with mobile navigation

## Key Implementation Patterns

### Data Synchronization Pattern

**Critical:** All public pages fetch data dynamically to stay synchronized with admin changes.

```typescript
// ❌ WRONG - Static import causes stale data
import marqueData from "@/data/marque.json"

// ✅ CORRECT - Dynamic fetch ensures real-time sync
const [marques, setMarques] = useState<MarqueData[]>([])
useEffect(() => {
  fetch('/api/cms/marques')
    .then(res => res.json())
    .then(data => setMarques(data.marques))
}, [])
```

**Why:** The admin panel writes directly to JSON files. Static imports are frozen at build time, but dynamic API calls read the current file state.

**Affected Files:**
- `src/app/page.tsx` - Homepage
- `src/app/marques/page.tsx` - Brand listing
- `src/app/marques/[slug]/page.tsx` - Brand detail pages

### Image URL Pattern

**Critical:** Always use `getImageUrl()` from `imageUtils.ts` to handle both static and uploaded images correctly.

```typescript
import { getImageUrl, getImageUrlWithCacheBusting } from "@/utils/imageUtils"

// Public pages - no cache busting needed
<Image src={getImageUrl(marque.mainImage)} alt={marque.nom} />

// Admin panel - cache busting to see changes immediately
<Image src={getImageUrlWithCacheBusting(marque.mainImage)} alt={marque.nom} />
```

**How it works:**
1. `isUploadedImage()` detects timestamp prefix (`^\d{13}-`)
2. If uploaded: routes to `/api/serve-image/[...path]`
3. If static: uses direct `/img/` path
4. Cache busting adds `?t=${Date.now()}` for admin only

### Component Patterns

**Client Components:** Most components are client components (`"use client"`) for interactivity:
- Admin panel (all state management)
- Brand filtering and search
- Image galleries with lazy loading
- Navigation with mobile menu

**Server Components:** Minimal use due to dynamic data requirements
- Layout components
- Static wrapper pages

## Troubleshooting

### Image Upload Issues

**Symptom:** Images uploaded via admin show 404 errors

**Causes & Solutions:**
1. Check `unoptimized: true` is set in `next.config.ts`
2. Verify image file exists in `/public/img/[BrandName]/` directory
3. Ensure using `getImageUrl()` not hardcoded paths
4. For timestamped images, verify `/api/serve-image/[...path]` is working

### Cache Issues

**Symptom:** Changes in admin not appearing on public pages

**Solutions:**
1. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
2. Check auto-refresh is enabled in admin (5-second interval)
3. Verify public pages use `fetch('/api/cms/marques')` not static imports
4. Clear Next.js cache: `rm -rf .next && pnpm build`

### Build Issues

**ESLint Errors:**
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)
- Run `pnpm lint` manually to check for issues
- TypeScript errors still fail builds (`ignoreBuildErrors: false`)

**Production Build:**
- Run `pnpm build` to test production build locally
- Run `pnpm start` to test production server
- Dynamic data fetching works in both dev and production modes