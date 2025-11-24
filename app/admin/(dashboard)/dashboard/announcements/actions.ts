'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { announcementSchema } from '@/lib/validations';

export async function createAnnouncementAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = announcementSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || null,
      priority: formData.get('priority') || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.announcement.create({
      data: validated,
    });

    revalidatePath('/admin/dashboard/announcements');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.errors,
      };
    }

    console.error('Create announcement error:', error);
    return {
      success: false,
      error: 'Không thể tạo thông báo',
    };
  }
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  try {
    await requireAuth();

    const validated = announcementSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || null,
      priority: formData.get('priority') || 0,
      isActive: formData.get('isActive') === 'on',
    });

    await db.announcement.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/dashboard/announcements');
    revalidatePath(`/admin/dashboard/announcements/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.errors,
      };
    }

    console.error('Update announcement error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật thông báo',
    };
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    await requireAuth();

    await db.announcement.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/announcements');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete announcement error:', error);
    return {
      success: false,
      error: 'Không thể xóa thông báo',
    };
  }
}

export async function redirectToAnnouncementsList() {
  redirect('/admin/dashboard/announcements');
}
