'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const studentSchema = z.object({
  firstName: z.string().min(1, 'Tên là bắt buộc'),
  lastName: z.string().min(1, 'Họ là bắt buộc'),
  dateOfBirth: z.string().nullable().or(z.literal('')),
  gradeLevel: z
    .enum([
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
    ])
    .nullable()
    .or(z.literal('')),
  photoUrl: z.string().nullable().or(z.literal('')),
  parentName: z.string().nullable().or(z.literal('')),
  parentEmail: z.string().nullable().or(z.literal('')),
  parentPhone: z.string().nullable().or(z.literal('')),
  address: z.string().nullable().or(z.literal('')),
  emergencyContact: z.string().nullable().or(z.literal('')),
  notes: z.string().nullable().or(z.literal('')),
  isActive: z.boolean(),
});

export async function createStudentAction(formData: FormData) {
  try {
    await requireAuth();

    const dateOfBirth = formData.get('dateOfBirth');
    const gradeLevel = formData.get('gradeLevel');

    const validated = studentSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: dateOfBirth || null,
      gradeLevel: gradeLevel || null,
      photoUrl: formData.get('photoUrl') || null,
      parentName: formData.get('parentName') || null,
      parentEmail: formData.get('parentEmail') || null,
      parentPhone: formData.get('parentPhone') || null,
      address: formData.get('address') || null,
      emergencyContact: formData.get('emergencyContact') || null,
      notes: formData.get('notes') || null,
      isActive: formData.get('isActive') === 'on',
    });

    await db.student.create({
      data: {
        ...validated,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        gradeLevel: validated.gradeLevel || null,
      },
    });

    revalidatePath('/admin/dashboard/students');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Create student error:', error);
    return {
      success: false,
      error: 'Không thể tạo học sinh',
    };
  }
}

export async function updateStudentAction(id: string, formData: FormData) {
  try {
    await requireAuth();

    const dateOfBirth = formData.get('dateOfBirth');
    const gradeLevel = formData.get('gradeLevel');

    const validated = studentSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: dateOfBirth || null,
      gradeLevel: gradeLevel || null,
      photoUrl: formData.get('photoUrl') || null,
      parentName: formData.get('parentName') || null,
      parentEmail: formData.get('parentEmail') || null,
      parentPhone: formData.get('parentPhone') || null,
      address: formData.get('address') || null,
      emergencyContact: formData.get('emergencyContact') || null,
      notes: formData.get('notes') || null,
      isActive: formData.get('isActive') === 'on',
    });

    await db.student.update({
      where: { id },
      data: {
        ...validated,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        gradeLevel: validated.gradeLevel || null,
      },
    });

    revalidatePath('/admin/dashboard/students');
    revalidatePath(`/admin/dashboard/students/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Update student error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật học sinh',
    };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    await requireAuth();

    await db.student.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/students');
  } catch (error) {
    console.error('Delete student error:', error);
    return {
      success: false,
      error: 'Không thể xóa học sinh',
    };
  }

  redirect('/admin/dashboard/students');
}

export async function redirectToStudentsList() {
  redirect('/admin/dashboard/students');
}
