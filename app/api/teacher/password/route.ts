import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getTeacherSession } from '@/lib/teacher-auth';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getTeacherSession();
    if (!session?.teacherId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = changePasswordSchema.parse(body);

    // Get teacher with password
    const teacher = await db.teacher.findUnique({
      where: { id: session.teacherId },
      select: { id: true, password: true },
    });

    if (!teacher || !teacher.password) {
      return NextResponse.json(
        { success: false, error: 'Không thể xác thực tài khoản' },
        { status: 400 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      validated.currentPassword,
      teacher.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu hiện tại không đúng' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

    // Update password
    await db.teacher.update({
      where: { id: session.teacherId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to change password:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
