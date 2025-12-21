import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const contactSchema = z.object({
  name: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Chủ đề là bắt buộc'),
  message: z.string().min(1, 'Tin nhắn là bắt buộc').max(5000, 'Tin nhắn quá dài'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const message = await db.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tin nhắn đã được gửi thành công',
      data: { id: message.id },
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

    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi gửi tin nhắn',
      },
      { status: 500 }
    );
  }
}
