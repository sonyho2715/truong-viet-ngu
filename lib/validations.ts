/**
 * Validation Schemas using Zod
 * All input validation for forms and API endpoints
 */

import { z } from 'zod';

// ============================================
// AUTHENTICATION
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// ANNOUNCEMENTS
// ============================================

export const announcementSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().min(1, 'Nội dung không được để trống'),
  category: z.enum(['CHOIR', 'BIBLE', 'EVENT', 'GENERAL', 'HOLIDAY']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  priority: z.coerce.number().min(0).max(10).default(0),
  isActive: z.boolean().default(true),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

// ============================================
// CLASSES
// ============================================

export const classSchema = z.object({
  name: z.string().min(1, 'Tên lớp không được để trống'),
  gradeLevel: z.enum([
    'MAU_GIAO_A',
    'MAU_GIAO_B',
    'MAU_GIAO_C',
    'LOP_1',
    'LOP_2',
    'LOP_3',
    'LOP_4',
    'LOP_5',
  ]),
  teacherName: z.string().optional().nullable(),
  teacherEmail: z.string().email('Email không hợp lệ').optional().nullable().or(z.literal('')),
  classroomImage: z.string().optional().nullable(),
  classPhotoImage: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type ClassInput = z.infer<typeof classSchema>;

// ============================================
// LEARNING MATERIALS
// ============================================

export const learningMaterialSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  gradeLevel: z.enum([
    'MAU_GIAO_A',
    'MAU_GIAO_B',
    'MAU_GIAO_C',
    'LOP_1',
    'LOP_2',
    'LOP_3',
    'LOP_4',
    'LOP_5',
  ]),
  lessonNumbers: z.string().optional().nullable(),
  externalLink: z.string().url('Link không hợp lệ').optional().nullable().or(z.literal('')),
  fileUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type LearningMaterialInput = z.infer<typeof learningMaterialSchema>;

// ============================================
// SITE SETTINGS
// ============================================

export const siteSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Tên tổ chức không được để trống'),
  subtitle: z.string().min(1, 'Phụ đề không được để trống'),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  leftLogoUrl: z.string().optional().nullable(),
  rightLogoUrl: z.string().optional().nullable(),
  heroBackground: z.string().optional().nullable(),
  heroBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Mã màu không hợp lệ'),
  welcomeMessage: z.string().optional().nullable(),
  contactEmail: z.string().email('Email không hợp lệ').optional().nullable().or(z.literal('')),
  contactPhone: z.string().optional().nullable(),
  facebookUrl: z.string().url('Link không hợp lệ').optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url('Link không hợp lệ').optional().nullable().or(z.literal('')),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ============================================
// HELPER TYPES
// ============================================

export const categoryLabels: Record<string, string> = {
  CHOIR: 'Ca đoàn TNTT',
  BIBLE: 'Đọc Sách Thánh',
  EVENT: 'Sự kiện',
  GENERAL: 'Thông báo chung',
  HOLIDAY: 'Nghỉ lễ',
};

export const gradeLevelLabels: Record<string, string> = {
  MAU_GIAO_A: 'Mẫu giáo A',
  MAU_GIAO_B: 'Mẫu giáo B',
  MAU_GIAO_C: 'Mẫu giáo C',
  LOP_1: 'Lớp 1',
  LOP_2: 'Lớp 2',
  LOP_3: 'Lớp 3',
  LOP_4: 'Lớp 4',
  LOP_5: 'Lớp 5',
};
