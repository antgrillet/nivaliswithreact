# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: Always use pnpm for package management in this project**

- `pnpm run dev` - Start development server with turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint checks
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new package

## Project Architecture

This is a Next.js 15 application using the App Router architecture for a fashion/retail brand showcase website called "Nivalis". The application presents multiple fashion brands with their images, descriptions, and product catalogs.

### Key Directories

- **`src/app/`** - Next.js App Router pages and API routes
  - `marques/` - Brand showcase pages with dynamic routing
  - `api/` - API endpoints for images, downloads, and CMS functionality
- **`src/components/`** - Reusable React components
  - `marques/` - Brand-specific components (filtering, lists, statistics)
  - `ui/` - UI components (buttons, cards, inputs)
- **`src/data/`** - JSON data files
  - `marque.json` - Brand data with descriptions, images, and metadata
  - `content.json` - General content data
- **`public/img/`** - Static image assets organized by brand folders

### Data Structure

Brand data is stored in `src/data/marque.json` with the following structure:
- Each brand has French/English descriptions, image folder paths, logos, and categorization
- Images are organized in `/public/img/[BrandName]/` directories
- Supports videos, PDFs, and multi-language content

### API Design

The application includes a comprehensive image API system:
- `/api/images` - Fetch images from specific brand folders
- `/api/images/bulk` - Batch image retrieval for multiple brands
- `/api/images/random` - Random image selection
- `/api/download` - Handle file downloads (PDFs, catalogs)
- `/api/cms/` - Content management endpoints

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Fonts**: Work Sans, Playfair Display (Google Fonts)

### Configuration Notes

- ESLint checks are disabled during builds (`ignoreDuringBuilds: true`) but can be run manually with `pnpm run lint`
- ESLint rules configured to allow unused variables and any types for development flexibility
- Image optimization is disabled (`unoptimized: true`) to support dynamic image uploads from admin
- SVG images are allowed with security policies
- Custom headers configured for PDF downloads and static assets with long cache TTL
- TypeScript strict mode enabled
- pnpm is the preferred package manager

### Admin Panel (`/admin`)

Complete content management system with the following features:

**Brand Management:**
- Create, update, and delete brands (`/api/cms/marques`)
- Upload brand logos, main images, and gallery images (`/api/cms/images`)
- Manage brand descriptions (French/English), types, and tags
- Auto-refresh functionality every 5 seconds

**Content Management:**
- Edit homepage content sections (`/api/cms/content`)
- Manage team member information and images
- Upload and manage content images (`/api/cms/content-images`)
- Support for nested content structures and arrays

**Image Management:**
- Drag & drop image uploads with preview
- Automatic image optimization (AVIF/WebP)
- Image replacement and deletion
- Support for special characters in filenames
- Organized storage in `/public/img/[BrandName]/`

**Security & Performance:**
- No authentication required (internal tool)
- Real-time data synchronization
- Optimized image serving with caching
- Error handling and user feedback

### Development Notes

- The application is primarily in French with English translations
- Brand pages use dynamic routing with slug-based URLs
- Image galleries support caching and lazy loading
- The CMS API provides content management capabilities
- File downloads are handled through dedicated API routes
- Always use pnpm for package management

### Image Upload and Cache Management

**Problem**: In production mode, uploaded images were showing 404 errors because Next.js serves static files differently than in development mode.

**Solution**: Implemented cache-busting for dynamically uploaded images:

1. **Configuration**: Modified `next.config.ts` to disable caching for `/img` directory:
   ```typescript
   {
     source: "/img/:path*",
     headers: [
       {
         key: "Cache-Control",
         value: "public, max-age=0, must-revalidate",
       },
     ],
   }
   ```

2. **Cache-busting**: Added timestamp parameters to all image URLs:
   - Admin panel: `src={`${imagePath}?t=${Date.now()}`}`
   - Brand pages: `src={`${imagePath}?t=${Date.now()}`}`
   - Image gallery: `src={`${imagePath}?t=${Date.now()}`}`

3. **Image Optimization**: Set `unoptimized: true` for uploaded images in Next.js Image component

**Files Modified**:
- `next.config.ts` - Cache headers configuration
- `src/app/admin/page.tsx` - Admin panel image displays
- `src/app/marques/[slug]/page.tsx` - Brand page image displays
- `src/components/ImageGallery.tsx` - Gallery component image displays

**Testing**: Both `pnpm dev` and `pnpm build && pnpm start` work correctly with image uploads now visible immediately in production mode.

### Data Synchronization Issue & Solution

**Problem**: Initially, uploaded images were visible in the admin but not on public pages because they used different data sources:
- Admin used `/api/cms/marques` (dynamic API) → saw updates in real-time
- Public pages used `import marqueData from "@/data/marque.json"` (static import) → data frozen at build time

**Solution**: Replaced static imports with dynamic API calls across all public pages:

1. **Page d'accueil** (`/src/app/page.tsx`):
   - Replaced static import with `useEffect` and `fetch('/api/cms/marques')`
   - Added loading states and error handling
   - Passes dynamic data to `BrandSection` component

2. **Liste des marques** (`/src/app/marques/page.tsx`):
   - Replaced static import with dynamic API call
   - Added loading skeleton and error states
   - Maintains existing filtering logic with dynamic data

3. **Détail d'une marque** (`/src/app/marques/[slug]/page.tsx`):
   - Replaced static import with dynamic API call
   - Calculates similar brands from dynamic data
   - Maintains slug-to-brand-name conversion logic

**Result**: 
- ✅ Admin and public pages now synchronized in real-time
- ✅ Images uploaded via admin appear immediately on public pages
- ✅ All data changes reflect across the entire application
- ✅ Both `pnpm dev` and `pnpm build && pnpm start` work correctly

### Development vs Production

**Development Mode (`pnpm run dev`):**
- Uses Turbopack for fast builds
- Hot reloading enabled
- ESLint runs on-demand
- Unoptimized images for faster development

**Production Mode (`pnpm run build && pnpm start`):**
- Uses Webpack for optimized builds
- Static page generation
- ESLint disabled during builds for faster compilation
- Images served unoptimized to support dynamic admin uploads
- Long cache TTL for static assets

### Troubleshooting

**Image Upload Issues:**
- If you get `400 Bad Request` errors for images uploaded via admin, ensure `unoptimized: true` is set in `next.config.ts`
- Dynamic image uploads from admin are not compatible with Next.js image optimization
- This affects images with timestamps in their names (e.g., `1752768804363-boutique_hero.jpg`)

**Cache Issues:**
- Clear browser cache if images don't update after admin changes
- Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check that image files exist in `/public/img/[BrandName]/` directory