/**
 * Script de migration des images locales vers Vercel Blob Storage
 *
 * Usage: npx tsx scripts/migrate-to-blob.ts
 *
 * Ce script:
 * 1. Parcourt toutes les images dans /public/img/
 * 2. Upload chaque image vers Vercel Blob
 * 3. Met a jour les fichiers JSON (marque.json, content.json) avec les nouvelles URLs
 * 4. Genere un fichier de mapping pour reference
 */

import { put } from '@vercel/blob';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) return;
    // Remove 'export ' prefix if present
    const cleanLine = line.replace(/^export\s+/, '');
    const [key, ...valueParts] = cleanLine.split('=');
    if (key && valueParts.length > 0) {
      // Remove quotes from value
      const value = valueParts.join('=').replace(/^["']|["']$/g, '').trim();
      process.env[key.trim()] = value;
    }
  });
  console.log('Loaded environment from .env.local');
}

// Configuration
const PUBLIC_IMG_DIR = path.join(process.cwd(), 'public/img');
const MARQUES_FILE = path.join(process.cwd(), 'src/data/marque.json');
const CONTENT_FILE = path.join(process.cwd(), 'src/data/content.json');
const MAPPING_FILE = path.join(process.cwd(), 'url-mapping.json');

interface MigrationResult {
  oldPath: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'];

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

function getAllImages(dir: string, basePath: string = ''): { localPath: string; relativePath: string }[] {
  const images: { localPath: string; relativePath: string }[] = [];

  if (!existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return images;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);

    if (statSync(fullPath).isDirectory()) {
      images.push(...getAllImages(fullPath, relativePath));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        images.push({
          localPath: fullPath,
          relativePath: `/img/${relativePath.replace(/\\/g, '/')}`,
        });
      }
    }
  }

  return images;
}

async function migrateAllImages(): Promise<{
  results: MigrationResult[];
  urlMapping: Record<string, string>;
}> {
  console.log('Starting migration to Vercel Blob Storage...\n');

  const results: MigrationResult[] = [];
  const urlMapping: Record<string, string> = {};

  // Get all images
  const images = getAllImages(PUBLIC_IMG_DIR);
  console.log(`Found ${images.length} images to migrate\n`);

  // Migrate each image
  for (let i = 0; i < images.length; i++) {
    const { localPath, relativePath } = images[i];

    // Create blob path based on directory structure
    const pathParts = relativePath.replace('/img/', '').split('/');
    const brandOrSection = pathParts[0];
    const fileName = pathParts[pathParts.length - 1];

    const blobPath = `marques/${brandOrSection}/${fileName}`;

    console.log(`[${i + 1}/${images.length}] Migrating: ${relativePath}`);

    const result = await migrateImage(localPath, blobPath);
    results.push(result);

    if (result.success) {
      urlMapping[relativePath] = result.newUrl;
      console.log(`  ✅ Success: ${result.newUrl.substring(0, 60)}...`);
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
    }
  }

  // Save mapping
  writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2));
  console.log(`\nURL mapping saved to: ${MAPPING_FILE}`);

  return { results, urlMapping };
}

function updateJsonFile(
  filePath: string,
  urlMapping: Record<string, string>,
  name: string
): void {
  if (!existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  let data = JSON.parse(content);

  // Recursive function to replace URLs in any object
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

  data = replaceUrls(data);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Updated ${name}`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('VERCEL BLOB MIGRATION SCRIPT');
  console.log('='.repeat(60));
  console.log();

  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
    console.log('\nPlease set it in .env.local or as an environment variable:');
    console.log('  export BLOB_READ_WRITE_TOKEN="your_token_here"');
    process.exit(1);
  }

  try {
    // Step 1: Migrate images
    const { results, urlMapping } = await migrateAllImages();

    // Step 2: Update JSON files
    console.log('\n' + '='.repeat(60));
    console.log('UPDATING JSON FILES');
    console.log('='.repeat(60) + '\n');

    updateJsonFile(MARQUES_FILE, urlMapping, 'marque.json');
    updateJsonFile(CONTENT_FILE, urlMapping, 'content.json');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\nTotal images: ${results.length}`);
    console.log(`  ✅ Successful: ${successful}`);
    console.log(`  ❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailed migrations:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.oldPath}: ${r.error}`);
      });
    }

    console.log(`\nURL mapping saved to: ${MAPPING_FILE}`);
    console.log('\n⚠️  IMPORTANT: Keep your local images for 2 weeks as a backup');
    console.log('    After verifying everything works, you can remove /public/img/');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
