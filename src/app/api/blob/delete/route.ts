import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-guard';

// DELETE - Suppression simple via query param
export async function DELETE(request: Request) {
  if (!(await getSessionUser(request.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ success: true, deleted: url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Suppression multiple
export async function POST(request: Request) {
  if (!(await getSessionUser(request.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { urls } = await request.json();

  if (!urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: 'URLs array required' }, { status: 400 });
  }

  try {
    await del(urls);
    return NextResponse.json({ success: true, deleted: urls });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
