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
