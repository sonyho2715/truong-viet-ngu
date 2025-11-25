'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Học sinh là bắt buộc'),
  classId: z.string().min(1, 'Lớp học là bắt buộc'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED']),
  notes: z.string().nullable().or(z.literal('')),
});

export async function enrollStudentAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = enrollmentSchema.parse({
      studentId: formData.get('studentId'),
      classId: formData.get('classId'),
      status: formData.get('status') || 'ACTIVE',
      notes: formData.get('notes') || null,
    });

    // Check if student is already enrolled
    const existing = await db.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: validated.studentId,
          classId: validated.classId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: 'Học sinh đã được ghi danh vào lớp này',
      };
    }

    await db.enrollment.create({
      data: validated,
    });

    revalidatePath(`/admin/dashboard/classes/${validated.classId}`);
    revalidatePath('/admin/dashboard/classes');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.issues,
      };
    }

    console.error('Enroll student error:', error);
    return {
      success: false,
      error: 'Không thể ghi danh học sinh',
    };
  }
}

export async function updateEnrollmentStatusAction(
  enrollmentId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'DROPPED'
) {
  try {
    await requireAuth();

    const enrollment = await db.enrollment.update({
      where: { id: enrollmentId },
      data: { status },
      include: { class: true },
    });

    revalidatePath(`/admin/dashboard/classes/${enrollment.classId}`);
    revalidatePath('/admin/dashboard/classes');
    return { success: true };
  } catch (error) {
    console.error('Update enrollment status error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật trạng thái ghi danh',
    };
  }
}

export async function removeEnrollmentAction(enrollmentId: string) {
  try {
    await requireAuth();

    const enrollment = await db.enrollment.delete({
      where: { id: enrollmentId },
      include: { class: true },
    });

    revalidatePath(`/admin/dashboard/classes/${enrollment.classId}`);
    revalidatePath('/admin/dashboard/classes');
    return { success: true };
  } catch (error) {
    console.error('Remove enrollment error:', error);
    return {
      success: false,
      error: 'Không thể xóa ghi danh',
    };
  }
}
