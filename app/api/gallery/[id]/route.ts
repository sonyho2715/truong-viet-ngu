import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const album = await db.galleryAlbum.findUnique({
      where: { id, isActive: true },
      include: {
        photos: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: album });
  } catch (error) {
    console.error('Failed to fetch album:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
