'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '@prisma/client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import {
  createStudentAction,
  updateStudentAction,
  redirectToStudentsList,
} from '@/app/admin/(dashboard)/dashboard/students/actions';

interface StudentFormProps {
  mode: 'create' | 'edit';
  initialData?: Student;
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

export function StudentForm({ mode, initialData }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photoUrl || null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Add photo URL to form data
    if (photoUrl) {
      formData.set('photoUrl', photoUrl);
    } else {
      formData.delete('photoUrl');
    }

    try {
      const result =
        mode === 'create'
          ? await createStudentAction(formData)
          : await updateStudentAction(initialData!.id, formData);

      if (result.success) {
        toast.success(
          mode === 'create' ? 'Tạo học sinh thành công' : 'Cập nhật học sinh thành công'
        );
        await redirectToStudentsList();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch {
      setError('Có lỗi xảy ra khi lưu thông tin học sinh');
      toast.error('Có lỗi xảy ra khi lưu thông tin học sinh');
    } finally {
      setLoading(false);
    }
  }

  const dateOfBirthValue = initialData?.dateOfBirth
    ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
    : '';

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-gray-900">
          Thông tin cơ bản
        </h3>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            defaultValue={initialData?.firstName}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="VD: John"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
            Họ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            defaultValue={initialData?.lastName}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="VD: Nguyễn"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="mb-2 block text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            defaultValue={dateOfBirthValue}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        {/* Grade Level */}
        <div>
          <label htmlFor="gradeLevel" className="mb-2 block text-sm font-medium text-gray-700">
            Cấp lớp
          </label>
          <select
            id="gradeLevel"
            name="gradeLevel"
            defaultValue={initialData?.gradeLevel || ''}
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

        {/* Photo Upload */}
        <div>
          <ImageUpload
            value={photoUrl}
            onChange={setPhotoUrl}
            category="general"
            label="Ảnh học sinh"
            helpText="Ảnh chân dung của học sinh"
            disabled={loading}
          />
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="font-serif text-lg font-semibold text-gray-900">
          Thông tin phụ huynh
        </h3>

        {/* Parent Name */}
        <div>
          <label htmlFor="parentName" className="mb-2 block text-sm font-medium text-gray-700">
            Tên phụ huynh
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            defaultValue={initialData?.parentName || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="VD: Ông/Bà Nguyễn Văn A"
          />
        </div>

        {/* Parent Email */}
        <div>
          <label htmlFor="parentEmail" className="mb-2 block text-sm font-medium text-gray-700">
            Email phụ huynh
          </label>
          <input
            type="email"
            id="parentEmail"
            name="parentEmail"
            defaultValue={initialData?.parentEmail || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="email@example.com"
          />
        </div>

        {/* Parent Phone */}
        <div>
          <label htmlFor="parentPhone" className="mb-2 block text-sm font-medium text-gray-700">
            Số điện thoại phụ huynh
          </label>
          <input
            type="tel"
            id="parentPhone"
            name="parentPhone"
            defaultValue={initialData?.parentPhone || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="(808) 123-4567"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={initialData?.address || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Địa chỉ nhà"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label htmlFor="emergencyContact" className="mb-2 block text-sm font-medium text-gray-700">
            Liên hệ khẩn cấp
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            defaultValue={initialData?.emergencyContact || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Tên và số điện thoại người liên hệ khẩn cấp"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="font-serif text-lg font-semibold text-gray-900">
          Thông tin bổ sung
        </h3>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={initialData?.notes || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Ghi chú về học sinh (dị ứng, nhu cầu đặc biệt, v.v.)"
          />
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
            Học sinh đang theo học
          </label>
        </div>
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
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo học sinh' : 'Cập nhật'}
        </button>
      </div>
    </form>
  );
}
