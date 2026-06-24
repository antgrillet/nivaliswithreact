import { put, del, list } from '@vercel/blob';
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

interface MarqueRow {
  nom: string;
  logo: string | null;
  main_image: string | null;
  images: string[] | null;
  videos: string[] | null;
}

async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

// Helper pour verifier si une URL est une URL Vercel Blob
function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

// POST - Upload image vers Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { rows } = await query<MarqueRow>(
      "SELECT nom, logo, main_image, images, videos FROM marques WHERE nom = $1",
      [marque]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const marqueData = rows[0];
    let oldUrl: string | null = null;
    let logo = marqueData.logo;
    let mainImage = marqueData.main_image;
    let images: string[] = marqueData.images ?? [];

    switch (action) {
      case 'logo':
        oldUrl = logo || null;
        logo = blob.url;
        break;
      case 'mainImage':
        oldUrl = mainImage || null;
        mainImage = blob.url;
        break;
      case 'add':
        images = [...images, blob.url];
        break;
      case 'replace':
        if (!replaceIndex) {
          return NextResponse.json(
            { error: 'replaceIndex required' },
            { status: 400 }
          );
        }
        const idx = parseInt(replaceIndex as string);
        if (images[idx]) {
          oldUrl = images[idx];
          images = images.map((value, index) =>
            index === idx ? blob.url : value
          );
        }
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Supprimer l'ancienne image si elle existe sur Vercel Blob
    if (oldUrl && isBlobUrl(oldUrl)) {
      try {
        await del(oldUrl);
      } catch (e) {
        console.warn('Could not delete old blob:', oldUrl, e);
      }
    }

    const { rows: updatedRows } = await query<MarqueRow>(
      `UPDATE marques
       SET logo = $1,
           main_image = $2,
           images = $3::text[],
           updated_at = now()
       WHERE nom = $4
       RETURNING nom, logo, main_image, images, videos`,
      [logo, mainImage, images, marque]
    );

    revalidateTag("marques", "max");
    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      marque: updatedRows[0],
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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { rows } = await query<MarqueRow>(
      "SELECT nom, logo, main_image, images, videos FROM marques WHERE nom = $1",
      [marqueName]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }

    const marqueData = rows[0];
    let logo = marqueData.logo;
    let mainImage = marqueData.main_image;
    let images: string[] = marqueData.images ?? [];

    switch (type) {
      case 'gallery':
        images = images.filter((img) => img !== imageUrl);
        break;
      case 'main':
        mainImage = null;
        break;
      case 'logo':
        logo = null;
        break;
    }

    const { rows: updatedRows } = await query<MarqueRow>(
      `UPDATE marques
       SET logo = $1,
           main_image = $2,
           images = $3::text[],
           updated_at = now()
       WHERE nom = $4
       RETURNING nom, logo, main_image, images, videos`,
      [logo, mainImage, images, marqueName]
    );

    revalidateTag("marques", "max");
    return NextResponse.json({ success: true, marque: updatedRows[0] });
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

    const { rows } = await query<MarqueRow>(
      "SELECT nom, logo, main_image, images, videos FROM marques WHERE nom = $1",
      [marqueName]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Marque not found' }, { status: 404 });
    }
    const marque = rows[0];

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
      mainImage: marque.main_image || null,
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
