'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export async function loginAction(formData: FormData) {
  try {
    const validated = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Find admin by email
    const admin = await db.admin.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (!admin) {
      return {
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      };
    }

    // Check if admin is active
    if (!admin.isActive) {
      return {
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa',
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(validated.password, admin.password);

    if (!passwordMatch) {
      return {
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      };
    }

    // Create session
    const session = await getSession();
    session.adminId = admin.id;
    session.email = admin.email;
    session.name = admin.name;
    session.role = admin.role;
    session.isLoggedIn = true;

    await session.save();

    // Update last login time
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    console.error('Login error:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    };
  }
}

export async function redirectToDashboard() {
  redirect('/admin/dashboard');
}
