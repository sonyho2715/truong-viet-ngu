'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LearningMaterial } from '@prisma/client';
import {
  createMaterialAction,
  updateMaterialAction,
  redirectToMaterialsList,
} from '@/app/admin/(dashboard)/dashboard/materials/actions';

interface MaterialFormProps {
  mode: 'create' | 'edit';
  initialData?: LearningMaterial;
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

export function MaterialForm({ mode, initialData }: MaterialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result =
        mode === 'create'
          ? await createMaterialAction(formData)
          : await updateMaterialAction(initialData!.id, formData);

      if (result.success) {
        await redirectToMaterialsList();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu tài liệu');
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

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
          Tên tài liệu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={initialData?.title}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="VD: Tomathien.org Lessons"
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

      {/* Lesson Numbers */}
      <div>
        <label htmlFor="lessonNumbers" className="mb-2 block text-sm font-medium text-gray-700">
          Số bài học
        </label>
        <input
          type="text"
          id="lessonNumbers"
          name="lessonNumbers"
          defaultValue={initialData?.lessonNumbers || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="VD: 1 + 21 17 hoặc 1 tới 16"
        />
        <p className="mt-1 text-xs text-gray-500">Ghi rõ các bài học trong tài liệu này</p>
      </div>

      {/* External Link */}
      <div>
        <label htmlFor="externalLink" className="mb-2 block text-sm font-medium text-gray-700">
          Link tài liệu ngoài
        </label>
        <input
          type="url"
          id="externalLink"
          name="externalLink"
          defaultValue={initialData?.externalLink || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="https://example.com/material"
        />
        <p className="mt-1 text-xs text-gray-500">URL đến tài liệu trên website khác</p>
      </div>

      {/* File URL */}
      <div>
        <label htmlFor="fileUrl" className="mb-2 block text-sm font-medium text-gray-700">
          Link file đính kèm
        </label>
        <input
          type="url"
          id="fileUrl"
          name="fileUrl"
          defaultValue={initialData?.fileUrl || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          placeholder="https://example.com/file.pdf"
        />
        <p className="mt-1 text-xs text-gray-500">URL đến file PDF hoặc tài liệu</p>
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
          placeholder="Mô tả về tài liệu học tập..."
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
        <p className="mt-1 text-xs text-gray-500">Số thứ tự để sắp xếp tài liệu (0 = đầu tiên)</p>
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
          Hiển thị tài liệu này trên website
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
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo tài liệu' : 'Cập nhật'}
        </button>
      </div>
    </form>
  );
}
