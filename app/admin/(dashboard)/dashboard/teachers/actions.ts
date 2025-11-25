'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const teacherSchema = z.object({
  firstName: z.string().min(1, 'Tên là bắt buộc'),
  lastName: z.string().min(1, 'Họ là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().nullable().or(z.literal('')),
  photoUrl: z.string().nullable().or(z.literal('')),
  bio: z.string().nullable().or(z.literal('')),
  isActive: z.boolean(),
});

export async function createTeacherAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = teacherSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      photoUrl: formData.get('photoUrl') || null,
      bio: formData.get('bio') || null,
      isActive: formData.get('isActive') === 'on',
    });

    await db.teacher.create({
      data: validated,
    });

    revalidatePath('/admin/dashboard/teachers');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Create teacher error:', error);
    return {
      success: false,
      error: 'Không thể tạo giáo viên',
    };
  }
}

export async function updateTeacherAction(id: string, formData: FormData) {
  try {
    await requireAuth();

    const validated = teacherSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      photoUrl: formData.get('photoUrl') || null,
      bio: formData.get('bio') || null,
      isActive: formData.get('isActive') === 'on',
    });

    await db.teacher.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/dashboard/teachers');
    revalidatePath(`/admin/dashboard/teachers/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Update teacher error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật giáo viên',
    };
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    await requireAuth();

    await db.teacher.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/teachers');
    return { success: true };
  } catch (error) {
    console.error('Delete teacher error:', error);
    return { success: false, error: 'Không thể xóa giáo viên' };
  }
}

export async function redirectToTeachersList() {
  redirect('/admin/dashboard/teachers');
}
