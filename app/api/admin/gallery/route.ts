import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const createAlbumSchema = z.object({
  title: z.string().min(1, 'Tên album không được để trống'),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const albums = await db.galleryAlbum.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: albums });
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createAlbumSchema.parse(body);

    // Get max display order
    const maxOrder = await db.galleryAlbum.aggregate({
      _max: { displayOrder: true },
    });

    const album = await db.galleryAlbum.create({
      data: {
        title: validated.title,
        description: validated.description || null,
        coverImage: validated.coverImage || null,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
        isActive: validated.isActive ?? true,
        displayOrder: (maxOrder._max.displayOrder || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: album });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to create album:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
