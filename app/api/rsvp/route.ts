import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const rsvpSchema = z.object({
  eventId: z.string().min(1, 'Event ID là bắt buộc'),
  name: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  numberOfGuests: z.number().min(1).max(10),
  dietaryNeeds: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = rsvpSchema.parse(body);

    // Check if event exists and allows RSVP
    const event = await db.calendarEvent.findUnique({
      where: { id: validated.eventId },
      include: {
        _count: {
          select: { rsvps: true },
        },
        rsvps: {
          select: { numberOfGuests: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Sự kiện không tồn tại' },
        { status: 404 }
      );
    }

    if (!event.allowRSVP) {
      return NextResponse.json(
        { success: false, error: 'Sự kiện này không nhận đăng ký tham dự' },
        { status: 400 }
      );
    }

    // Check for existing RSVP with same email
    const existingRSVP = await db.eventRSVP.findUnique({
      where: {
        eventId_email: {
          eventId: validated.eventId,
          email: validated.email,
        },
      },
    });

    if (existingRSVP) {
      return NextResponse.json(
        { success: false, error: 'Email này đã đăng ký tham dự sự kiện' },
        { status: 400 }
      );
    }

    // Check capacity if maxAttendees is set
    if (event.maxAttendees) {
      const totalGuests = event.rsvps.reduce((sum, r) => sum + r.numberOfGuests, 0);
      if (totalGuests + validated.numberOfGuests > event.maxAttendees) {
        return NextResponse.json(
          { success: false, error: 'Sự kiện đã hết chỗ' },
          { status: 400 }
        );
      }
    }

    // Create RSVP
    const rsvp = await db.eventRSVP.create({
      data: {
        eventId: validated.eventId,
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        numberOfGuests: validated.numberOfGuests,
        dietaryNeeds: validated.dietaryNeeds || null,
        notes: validated.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      data: { id: rsvp.id },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thông tin không hợp lệ',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('RSVP error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi đăng ký',
      },
      { status: 500 }
    );
  }
}
