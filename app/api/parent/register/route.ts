import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getParentSession } from '@/lib/parent-auth';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  phone: z.string().optional(),
  studentCode: z.string().optional(), // To link with existing student
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingParent = await db.parent.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingParent) {
      return NextResponse.json(
        { success: false, error: 'Email này đã được sử dụng' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create parent account
    const parent = await db.parent.create({
      data: {
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone || null,
        isVerified: false, // Admin needs to verify
      },
    });

    // If student code provided, try to link student
    if (validated.studentCode) {
      // Look for student by their ID or by parent email match
      const student = await db.student.findFirst({
        where: {
          OR: [
            { id: validated.studentCode },
            { parentEmail: validated.email.toLowerCase() },
          ],
        },
      });

      if (student) {
        await db.student.update({
          where: { id: student.id },
          data: { parentId: parent.id },
        });
      }
    }

    // Auto-link students with matching parent email
    await db.student.updateMany({
      where: {
        parentEmail: validated.email.toLowerCase(),
        parentId: null,
      },
      data: { parentId: parent.id },
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

    console.error('Parent register error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    );
  }
}
