import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public endpoint - no authentication required
export async function GET() {
  try {
    const slides = await db.slideshowSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        subtitle: true,
        linkUrl: true,
        linkText: true,
      },
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
