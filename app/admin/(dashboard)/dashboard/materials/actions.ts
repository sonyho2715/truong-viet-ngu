'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const materialSchema = z.object({
  title: z.string().min(1, 'Tên tài liệu là bắt buộc'),
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
  lessonNumbers: z.string().nullable().or(z.literal('')),
  externalLink: z.string().nullable().or(z.literal('')),
  fileUrl: z.string().nullable().or(z.literal('')),
  description: z.string().nullable().or(z.literal('')),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export async function createMaterialAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = materialSchema.parse({
      title: formData.get('title'),
      gradeLevel: formData.get('gradeLevel'),
      lessonNumbers: formData.get('lessonNumbers') || null,
      externalLink: formData.get('externalLink') || null,
      fileUrl: formData.get('fileUrl') || null,
      description: formData.get('description') || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.learningMaterial.create({
      data: validated,
    });

    revalidatePath('/admin/dashboard/materials');
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

    console.error('Create material error:', error);
    return {
      success: false,
      error: 'Không thể tạo tài liệu',
    };
  }
}

export async function updateMaterialAction(id: string, formData: FormData) {
  try {
    await requireAuth();

    const validated = materialSchema.parse({
      title: formData.get('title'),
      gradeLevel: formData.get('gradeLevel'),
      lessonNumbers: formData.get('lessonNumbers') || null,
      externalLink: formData.get('externalLink') || null,
      fileUrl: formData.get('fileUrl') || null,
      description: formData.get('description') || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.learningMaterial.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/dashboard/materials');
    revalidatePath(`/admin/dashboard/materials/${id}`);
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

    console.error('Update material error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật tài liệu',
    };
  }
}

export async function deleteMaterialAction(id: string) {
  try {
    await requireAuth();

    await db.learningMaterial.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/materials');
    revalidatePath('/');
  } catch (error) {
    console.error('Delete material error:', error);
    return {
      success: false,
      error: 'Không thể xóa tài liệu',
    };
  }

  redirect('/admin/dashboard/materials');
}

export async function redirectToMaterialsList() {
  redirect('/admin/dashboard/materials');
}
