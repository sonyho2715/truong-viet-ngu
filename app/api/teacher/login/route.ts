import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getTeacherSession } from '@/lib/teacher-auth';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find teacher by email
    const teacher = await db.teacher.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check if teacher has a password set
    if (!teacher.password) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản chưa được thiết lập mật khẩu. Vui lòng liên hệ quản trị viên.' },
        { status: 401 }
      );
    }

    // Check if account is approved
    if (!teacher.isApproved) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đang chờ phê duyệt từ quản trị viên.' },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!teacher.isActive) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đã bị vô hiệu hóa.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Update last login time
    await db.teacher.update({
      where: { id: teacher.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    const session = await getTeacherSession();
    session.teacherId = teacher.id;
    session.email = teacher.email;
    session.firstName = teacher.firstName;
    session.lastName = teacher.lastName;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Teacher login error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
