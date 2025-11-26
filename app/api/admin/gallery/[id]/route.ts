import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateAlbumSchema = z.object({
  title: z.string().min(1, 'Tên album không được để trống'),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const album = await db.galleryAlbum.findUnique({
      where: { id },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateAlbumSchema.parse(body);

    const album = await db.galleryAlbum.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description || null,
        coverImage: validated.coverImage || null,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
        isActive: validated.isActive,
        displayOrder: validated.displayOrder,
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

    console.error('Failed to update album:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete all photos in the album first
    await db.galleryPhoto.deleteMany({
      where: { albumId: id },
    });

    // Then delete the album
    await db.galleryAlbum.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete album:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
