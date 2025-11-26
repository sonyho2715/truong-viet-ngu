import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateSlideSchema = z.object({
  imageUrl: z.string().min(1, 'Hình ảnh không được để trống'),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
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

    const slide = await db.slideshowSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'Slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: slide });
  } catch (error) {
    console.error('Failed to fetch slide:', error);
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
    const validated = updateSlideSchema.parse(body);

    const slide = await db.slideshowSlide.update({
      where: { id },
      data: {
        imageUrl: validated.imageUrl,
        title: validated.title || null,
        subtitle: validated.subtitle || null,
        linkUrl: validated.linkUrl || null,
        linkText: validated.linkText || null,
        isActive: validated.isActive,
        displayOrder: validated.displayOrder,
      },
    });

    return NextResponse.json({ success: true, data: slide });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to update slide:', error);
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

    await db.slideshowSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete slide:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
