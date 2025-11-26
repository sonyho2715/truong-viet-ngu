/**
 * CSV Export Utility
 * Provides functions for exporting data to CSV format
 */

type ExportValue = string | number | boolean | Date | null | undefined;

interface ExportOptions {
  filename: string;
  headers?: Record<string, string>; // Map of field names to display names
}

/**
 * Convert a value to CSV-safe string
 */
function escapeCSV(value: ExportValue): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('vi-VN');
  }

  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không';
  }

  const str = String(value);

  // Escape quotes and wrap in quotes if contains comma, newline, or quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generate CSV content from array of objects
 */
export function generateCSV<T extends Record<string, ExportValue>>(
  data: T[],
  options: ExportOptions
): string {
  if (data.length === 0) {
    return '';
  }

  const { headers } = options;
  const fields = Object.keys(data[0]);

  // Header row
  const headerRow = fields
    .map((field) => escapeCSV(headers?.[field] ?? field))
    .join(',');

  // Data rows
  const dataRows = data.map((row) =>
    fields.map((field) => escapeCSV(row[field])).join(',')
  );

  // Add BOM for Excel UTF-8 compatibility
  return '\uFEFF' + [headerRow, ...dataRows].join('\n');
}

/**
 * Student export headers
 */
export const studentExportHeaders: Record<string, string> = {
  firstName: 'Tên',
  lastName: 'Họ',
  dateOfBirth: 'Ngày sinh',
  gradeLevel: 'Cấp lớp',
  parentName: 'Phụ huynh',
  parentEmail: 'Email PH',
  parentPhone: 'SĐT PH',
  isActive: 'Đang học',
  createdAt: 'Ngày tạo',
};

/**
 * Class export headers
 */
export const classExportHeaders: Record<string, string> = {
  name: 'Tên lớp',
  gradeLevel: 'Cấp lớp',
  schedule: 'Lịch học',
  roomNumber: 'Phòng',
  teacherName: 'Giáo viên',
  studentCount: 'Số học sinh',
  isActive: 'Hoạt động',
};

/**
 * Teacher export headers
 */
export const teacherExportHeaders: Record<string, string> = {
  firstName: 'Tên',
  lastName: 'Họ',
  email: 'Email',
  phone: 'Số điện thoại',
  classCount: 'Số lớp dạy',
  isActive: 'Hoạt động',
};

/**
 * Grade level labels in Vietnamese
 */
export const gradeLevelLabels: Record<string, string> = {
  MAU_GIAO_A: 'Mẫu Giáo A',
  MAU_GIAO_B: 'Mẫu Giáo B',
  MAU_GIAO_C: 'Mẫu Giáo C',
  LOP_1: 'Lớp 1',
  LOP_2: 'Lớp 2',
  LOP_3: 'Lớp 3',
  LOP_4: 'Lớp 4',
  LOP_5: 'Lớp 5',
  LOP_6: 'Lớp 6',
  LOP_7: 'Lớp 7',
  AU_NHI: 'Ấu Nhi',
  THIEU_NHI: 'Thiếu Nhi',
  NGHIA_SI: 'Nghĩa Sĩ',
  HIEP_SI: 'Hiệp Sĩ',
};
