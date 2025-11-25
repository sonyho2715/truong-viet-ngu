'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const classSchema = z.object({
  name: z.string().min(1, 'Tên lớp là bắt buộc'),
  gradeLevel: z.enum([
    'MAU_GIAO_A',
    'MAU_GIAO_B',
    'MAU_GIAO_C',
    'LOP_1',
    'LOP_2',
    'LOP_3',
    'LOP_4',
    'LOP_5',
    'LOP_6',
    'LOP_7',
    'AU_NHI',
    'THIEU_NHI',
    'NGHIA_SI',
    'HIEP_SI',
  ]),
  teacherId: z.string().nullable().or(z.literal('')),
  classroomImage: z.string().nullable().or(z.literal('')),
  classPhotoImage: z.string().nullable().or(z.literal('')),
  schedule: z.string().nullable().or(z.literal('')),
  roomNumber: z.string().nullable().or(z.literal('')),
  description: z.string().nullable().or(z.literal('')),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export async function createClassAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = classSchema.parse({
      name: formData.get('name'),
      gradeLevel: formData.get('gradeLevel'),
      teacherId: formData.get('teacherId') || null,
      classroomImage: formData.get('classroomImage') || null,
      classPhotoImage: formData.get('classPhotoImage') || null,
      schedule: formData.get('schedule') || null,
      roomNumber: formData.get('roomNumber') || null,
      description: formData.get('description') || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.class.create({
      data: validated,
    });

    revalidatePath('/admin/dashboard/classes');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Create class error:', error);
    return {
      success: false,
      error: 'Không thể tạo lớp học',
    };
  }
}

export async function updateClassAction(id: string, formData: FormData) {
  try {
    await requireAuth();

    const validated = classSchema.parse({
      name: formData.get('name'),
      gradeLevel: formData.get('gradeLevel'),
      teacherId: formData.get('teacherId') || null,
      classroomImage: formData.get('classroomImage') || null,
      classPhotoImage: formData.get('classPhotoImage') || null,
      schedule: formData.get('schedule') || null,
      roomNumber: formData.get('roomNumber') || null,
      description: formData.get('description') || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.class.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/dashboard/classes');
    revalidatePath(`/admin/dashboard/classes/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Update class error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật lớp học',
    };
  }
}

export async function deleteClassAction(id: string) {
  try {
    await requireAuth();

    await db.class.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/classes');
    revalidatePath('/');
  } catch (error) {
    console.error('Delete class error:', error);
    return {
      success: false,
      error: 'Không thể xóa lớp học',
    };
  }

  redirect('/admin/dashboard/classes');
}

export async function redirectToClassesList() {
  redirect('/admin/dashboard/classes');
}
