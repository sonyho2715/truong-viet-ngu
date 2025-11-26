import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = subscribeSchema.parse(body);

    // Check if email already exists
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: 'Email này đã được đăng ký.' },
          { status: 400 }
        );
      }

      // Reactivate if previously unsubscribed
      await db.newsletterSubscriber.update({
        where: { email: validated.email },
        data: { isActive: true, name: validated.name || existing.name },
      });

      return NextResponse.json({ success: true });
    }

    await db.newsletterSubscriber.create({
      data: {
        email: validated.email,
        name: validated.name || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to subscribe to newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
