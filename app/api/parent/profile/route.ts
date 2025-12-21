import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireParentAuth } from '@/lib/parent-auth';

const updateSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
});

export async function GET() {
  try {
    const session = await requireParentAuth();

    const parent = await db.parent.findUnique({
      where: { id: session.parentId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông tin' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: parent });
  } catch (error) {
    console.error('Parent profile GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireParentAuth();
    const body = await req.json();
    const validated = updateSchema.parse(body);

    // Check if email is taken by another parent
    if (validated.email !== session.email) {
      const existingParent = await db.parent.findUnique({
        where: { email: validated.email.toLowerCase() },
      });

      if (existingParent && existingParent.id !== session.parentId) {
        return NextResponse.json(
          { success: false, error: 'Email này đã được sử dụng' },
          { status: 400 }
        );
      }
    }

    const parent = await db.parent.update({
      where: { id: session.parentId },
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email.toLowerCase(),
        phone: validated.phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });

    return NextResponse.json({ success: true, data: parent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Thông tin không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Parent profile PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
