'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Class } from '@prisma/client';
import {
  createClassAction,
  updateClassAction,
  redirectToClassesList,
} from '@/app/admin/(dashboard)/dashboard/classes/actions';

interface ClassFormProps {
  mode: 'create' | 'edit';
  initialData?: Class;
}

const gradeLevels = [
  { value: 'MAU_GIAO_A', label: 'Mẫu Giáo A' },
  { value: 'MAU_GIAO_B', label: 'Mẫu Giáo B' },
  { value: 'MAU_GIAO_C', label: 'Mẫu Giáo C' },
  { value: 'LOP_1', label: 'Lớp 1' },
  { value: 'LOP_2', label: 'Lớp 2' },
  { value: 'LOP_3', label: 'Lớp 3' },
  { value: 'LOP_4', label: 'Lớp 4' },
  { value: 'LOP_5', label: 'Lớp 5' },
  { value: 'LOP_6', label: 'Lớp 6' },
  { value: 'LOP_7', label: 'Lớp 7' },
  { value: 'AU_NHI', label: 'Ấu Nhi (TNTT)' },
  { value: 'THIEU_NHI', label: 'Thiếu Nhi (TNTT)' },
  { value: 'NGHIA_SI', label: 'Nghĩa Sĩ (TNTT)' },
  { value: 'HIEP_SI', label: 'Hiệp Sĩ (TNTT)' },
];

export function ClassForm({ mode, initialData }: ClassFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result =
        mode === 'create'
          ? await createClassAction(formData)
          : await updateClassAction(initialData!.id, formData);

      if (result.success) {
        await redirectToClassesList();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu lớp học');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
          Tên lớp học <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initialData?.name}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="VD: Lớp 1, Mẫu Giáo A..."
        />
      </div>

      {/* Grade Level */}
      <div>
        <label htmlFor="gradeLevel" className="mb-2 block text-sm font-medium text-gray-700">
          Cấp lớp <span className="text-red-500">*</span>
        </label>
        <select
          id="gradeLevel"
          name="gradeLevel"
          required
          defaultValue={initialData?.gradeLevel}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          <option value="">Chọn cấp lớp</option>
          {gradeLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Name */}
      <div>
        <label htmlFor="teacherName" className="mb-2 block text-sm font-medium text-gray-700">
          Giáo viên
        </label>
        <input
          type="text"
          id="teacherName"
          name="teacherName"
          defaultValue={initialData?.teacherName || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="Tên giáo viên"
        />
      </div>

      {/* Teacher Email */}
      <div>
        <label htmlFor="teacherEmail" className="mb-2 block text-sm font-medium text-gray-700">
          Email giáo viên
        </label>
        <input
          type="email"
          id="teacherEmail"
          name="teacherEmail"
          defaultValue={initialData?.teacherEmail || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="email@example.com"
        />
      </div>

      {/* Schedule */}
      <div>
        <label htmlFor="schedule" className="mb-2 block text-sm font-medium text-gray-700">
          Lịch học
        </label>
        <input
          type="text"
          id="schedule"
          name="schedule"
          defaultValue={initialData?.schedule || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="VD: Chủ Nhật 9:00 AM - 12:00 PM"
        />
      </div>

      {/* Room Number */}
      <div>
        <label htmlFor="roomNumber" className="mb-2 block text-sm font-medium text-gray-700">
          Số phòng
        </label>
        <input
          type="text"
          id="roomNumber"
          name="roomNumber"
          defaultValue={initialData?.roomNumber || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="VD: A101, B205..."
        />
      </div>

      {/* Classroom Image */}
      <div>
        <label htmlFor="classroomImage" className="mb-2 block text-sm font-medium text-gray-700">
          Link ảnh lớp học
        </label>
        <input
          type="url"
          id="classroomImage"
          name="classroomImage"
          defaultValue={initialData?.classroomImage || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">URL ảnh từ Unsplash hoặc nguồn khác</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="Mô tả về lớp học..."
        />
      </div>

      {/* Display Order */}
      <div>
        <label htmlFor="displayOrder" className="mb-2 block text-sm font-medium text-gray-700">
          Thứ tự hiển thị
        </label>
        <input
          type="number"
          id="displayOrder"
          name="displayOrder"
          defaultValue={initialData?.displayOrder || 0}
          min="0"
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <p className="mt-1 text-xs text-gray-500">Số thứ tự để sắp xếp lớp học (0 = đầu tiên)</p>
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          defaultChecked={initialData?.isActive !== false}
          className="h-5 w-5 rounded border-gray-300 text-brand-gold focus:ring-2 focus:ring-brand-gold"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Hiển thị lớp học này trên website
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-gold px-6 py-2 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo lớp học' : 'Cập nhật'}
        </button>
      </div>
    </form>
  );
}
