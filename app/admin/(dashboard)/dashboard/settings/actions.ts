'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const settingsSchema = z.object({
  organizationName: z.string().min(1, 'Tên tổ chức là bắt buộc'),
  subtitle: z.string().min(1, 'Phụ đề là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  leftLogoUrl: z.string().nullable().or(z.literal('')),
  rightLogoUrl: z.string().nullable().or(z.literal('')),
  heroBackground: z.string().nullable().or(z.literal('')),
  heroBackgroundColor: z.string().min(1, 'Màu nền là bắt buộc'),
  welcomeMessage: z.string().nullable().or(z.literal('')),
  contactEmail: z.string().email().nullable().or(z.literal('')),
  contactPhone: z.string().nullable().or(z.literal('')),
  address: z.string().nullable().or(z.literal('')),
  facebookUrl: z.string().nullable().or(z.literal('')),
  youtubeUrl: z.string().nullable().or(z.literal('')),
});

export async function updateSettingsAction(formData: FormData) {
  try {
    await requireAuth();

    const validated = settingsSchema.parse({
      organizationName: formData.get('organizationName'),
      subtitle: formData.get('subtitle'),
      location: formData.get('location'),
      leftLogoUrl: formData.get('leftLogoUrl') || null,
      rightLogoUrl: formData.get('rightLogoUrl') || null,
      heroBackground: formData.get('heroBackground') || null,
      heroBackgroundColor: formData.get('heroBackgroundColor'),
      welcomeMessage: formData.get('welcomeMessage') || null,
      contactEmail: formData.get('contactEmail') || null,
      contactPhone: formData.get('contactPhone') || null,
      address: formData.get('address') || null,
      facebookUrl: formData.get('facebookUrl') || null,
      youtubeUrl: formData.get('youtubeUrl') || null,
    });

    // Upsert the settings (create if doesn't exist, update if exists)
    await db.siteSetting.upsert({
      where: { id: 'site_settings' },
      update: validated,
      create: {
        id: 'site_settings',
        ...validated,
      },
    });

    revalidatePath('/admin/dashboard/settings');
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

    console.error('Update settings error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật cài đặt',
    };
  }
}
