import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const volunteerSchema = z.object({
  opportunityId: z.string().min(1, 'Opportunity ID là bắt buộc'),
  firstName: z.string().min(1, 'Tên là bắt buộc'),
  lastName: z.string().min(1, 'Họ là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = volunteerSchema.parse(body);

    // Check if opportunity exists
    const opportunity = await db.volunteerOpportunity.findUnique({
      where: { id: validated.opportunityId },
      include: {
        _count: {
          select: { signups: { where: { status: 'CONFIRMED' } } },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Cơ hội tình nguyện không tồn tại' },
        { status: 404 }
      );
    }

    if (!opportunity.isActive) {
      return NextResponse.json(
        { success: false, error: 'Cơ hội tình nguyện này không còn mở' },
        { status: 400 }
      );
    }

    // Check for existing signup with same email
    const existingSignup = await db.volunteerSignup.findUnique({
      where: {
        opportunityId_email: {
          opportunityId: validated.opportunityId,
          email: validated.email,
        },
      },
    });

    if (existingSignup) {
      return NextResponse.json(
        { success: false, error: 'Email này đã đăng ký cho cơ hội này' },
        { status: 400 }
      );
    }

    // Check capacity if spotsAvailable is set
    if (opportunity.spotsAvailable) {
      const confirmedCount = opportunity._count.signups;
      if (confirmedCount >= opportunity.spotsAvailable) {
        return NextResponse.json(
          { success: false, error: 'Đã hết chỗ cho cơ hội này' },
          { status: 400 }
        );
      }
    }

    // Create signup
    const signup = await db.volunteerSignup.create({
      data: {
        opportunityId: validated.opportunityId,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        notes: validated.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      data: { id: signup.id },
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

    console.error('Volunteer signup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi đăng ký',
      },
      { status: 500 }
    );
  }
}
