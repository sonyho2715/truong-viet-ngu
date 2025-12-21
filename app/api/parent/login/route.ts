import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getParentSession } from '@/lib/parent-auth';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Find parent by email
    const parent = await db.parent.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!parent.isActive) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đã bị khóa. Vui lòng liên hệ nhà trường.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, parent.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Update last login
    await db.parent.update({
      where: { id: parent.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    const session = await getParentSession();
    session.parentId = parent.id;
    session.email = parent.email;
    session.firstName = parent.firstName;
    session.lastName = parent.lastName;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        id: parent.id,
        email: parent.email,
        firstName: parent.firstName,
        lastName: parent.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Thông tin không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Parent login error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi đăng nhập' },
      { status: 500 }
    );
  }
}
