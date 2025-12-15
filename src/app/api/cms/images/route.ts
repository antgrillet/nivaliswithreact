import { put, del, list } from '@vercel/blob';
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface Marque {
  nom: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  imageFolder: string;
  mainImage?: string;
  logo?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  type?: string;
}

const DATA_FILE = path.join(process.cwd(), "src/data/marque.json");

// Helper pour lire/ecrire JSON
async function readMarques() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeMarques(data: { marques: Marque[] }) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Helper pour verifier si une URL est une URL Vercel Blob
function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

// POST - Upload image vers Vercel Blob
export async function POST(request: NextRequest) {
  try {
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
    const data = await readMarques();
    const marqueIndex = data.marques.findIndex((m: Marque) => m.nom === marque);

    if (marqueIndex === -1) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const marqueData = data.marques[marqueIndex];
    let oldUrl: string | null = null;

    switch (action) {
      case 'logo':
        oldUrl = marqueData.logo || null;
        marqueData.logo = blob.url;
        break;
      case 'mainImage':
        oldUrl = marqueData.mainImage || null;
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
    if (oldUrl && isBlobUrl(oldUrl)) {
      try {
        await del(oldUrl);
      } catch (e) {
        console.warn('Could not delete old blob:', oldUrl, e);
      }
    }

    await writeMarques(data);

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      marque: marqueData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer image de Vercel Blob
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueName = searchParams.get('marque');
    const imageUrl = searchParams.get('imageUrl');
    const type = searchParams.get('type'); // gallery, main, logo

    if (!marqueName || !imageUrl || !type) {
      return NextResponse.json(
        { error: 'Missing required params' },
        { status: 400 }
      );
    }

    // Supprimer de Vercel Blob si c'est une URL Blob
    if (isBlobUrl(imageUrl)) {
      try {
        await del(imageUrl);
      } catch (e) {
        console.warn('Could not delete blob:', imageUrl, e);
      }
    }

    // Mettre a jour le JSON
    const data = await readMarques();
    const marqueIndex = data.marques.findIndex((m: Marque) => m.nom === marqueName);

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

    await writeMarques(data);

    return NextResponse.json({ success: true, marque: marqueData });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - Lister images d'une marque (depuis JSON et optionnellement depuis Blob)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueName = searchParams.get('marque');
    const listBlobs = searchParams.get('listBlobs') === 'true';

    if (!marqueName) {
      return NextResponse.json({ error: 'Marque required' }, { status: 400 });
    }

    // Lire les donnees JSON
    const data = await readMarques();
    const marque = data.marques.find((m: Marque) => m.nom === marqueName);

    if (!marque) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const response: {
      marque: string;
      logo: string | null;
      mainImage: string | null;
      images: string[];
      videos: string[];
      blobs?: { url: string; pathname: string; size: number; uploadedAt: Date }[];
    } = {
      marque: marque.nom,
      logo: marque.logo || null,
      mainImage: marque.mainImage || null,
      images: marque.images || [],
      videos: marque.videos || [],
    };

    // Optionnel: lister depuis Vercel Blob avec prefix
    if (listBlobs) {
      try {
        const result = await list({
          prefix: `marques/${marqueName}/`,
        });
        response.blobs = result.blobs.map(blob => ({
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        }));
      } catch (e) {
        console.warn('Could not list blobs:', e);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
