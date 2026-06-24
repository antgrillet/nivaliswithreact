import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-guard';

export async function GET(request: Request) {
  if (!(await getSessionUser(request.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
