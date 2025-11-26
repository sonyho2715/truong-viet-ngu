import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const createSlideSchema = z.object({
  imageUrl: z.string().min(1, 'Hình ảnh không được để trống'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  linkUrl: z.string().optional(),
  linkText: z.string().optional(),
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

    const slides = await db.slideshowSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error('Failed to fetch slides:', error);
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
    const validated = createSlideSchema.parse(body);

    // Get max display order
    const maxOrder = await db.slideshowSlide.aggregate({
      _max: { displayOrder: true },
    });

    const slide = await db.slideshowSlide.create({
      data: {
        imageUrl: validated.imageUrl,
        title: validated.title || null,
        subtitle: validated.subtitle || null,
        linkUrl: validated.linkUrl || null,
        linkText: validated.linkText || null,
        isActive: validated.isActive ?? true,
        displayOrder: (maxOrder._max.displayOrder || 0) + 1,
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

    console.error('Failed to create slide:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
