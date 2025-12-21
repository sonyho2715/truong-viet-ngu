import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireParentAuth } from '@/lib/parent-auth';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export async function PUT(req: NextRequest) {
  try {
    const session = await requireParentAuth();
    const body = await req.json();
    const validated = passwordSchema.parse(body);

    // Get current parent
    const parent = await db.parent.findUnique({
      where: { id: session.parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(validated.currentPassword, parent.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu hiện tại không đúng' },
        { status: 400 }
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 12);
    await db.parent.update({
      where: { id: session.parentId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Thông tin không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Parent password PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
