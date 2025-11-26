import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Tên không được để trống'),
  lastName: z.string().min(1, 'Họ không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  bio: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingTeacher = await db.teacher.findUnique({
      where: { email: validated.email },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { success: false, error: 'Email này đã được đăng ký.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create teacher with inactive status (pending approval)
    const teacher = await db.teacher.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        bio: validated.bio || null,
        password: hashedPassword,
        isActive: false, // Pending approval
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: teacher.id, email: teacher.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to register teacher:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
