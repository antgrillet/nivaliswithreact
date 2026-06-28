import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-guard';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Auth : seul un admin connecté peut obtenir un token d'upload.
        // (Non appelé pour le webhook onUploadCompleted signé par Vercel.)
        const user = await getSessionUser(request.headers);
        if (!user) {
          throw new Error("Unauthorized");
        }
        // clientPayload contient: { marque, type, action }
        const payload = clientPayload ? JSON.parse(clientPayload) : {};

        // Les vidéos (fichiers volumineux) bénéficient d'une limite plus haute.
        const isVideo =
          payload?.type === 'video' ||
          /\.(mp4|webm|mov)$/i.test(pathname) ||
          /\/videos\//i.test(pathname);

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/svg+xml',
            'image/gif',
            'image/avif',
            'application/pdf',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-m4v',
            'video/ogg',
          ],
          maximumSizeInBytes: isVideo
            ? 200 * 1024 * 1024 // 200 Mo max pour la vidéo
            : 25 * 1024 * 1024, // 25 Mo max (images + PDF catalogues)
          addRandomSuffix: true, // Remplace les timestamps manuels
          tokenPayload: JSON.stringify(payload),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback apres upload reussi
        console.log('Upload completed:', blob.url);

        // Le tokenPayload contient les infos sur la marque et le type
        if (tokenPayload) {
          const payload = JSON.parse(tokenPayload);
          console.log('Upload payload:', payload);
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
