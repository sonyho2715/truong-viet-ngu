'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '@prisma/client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
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
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="heading-4">Thông tin cơ bản</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tên"
            name="firstName"
            required
            defaultValue={initialData?.firstName}
            placeholder="VD: John"
          />

          <Input
            label="Họ"
            name="lastName"
            required
            defaultValue={initialData?.lastName}
            placeholder="VD: Nguyễn"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            defaultValue={dateOfBirthValue}
          />

          <Select
            label="Cấp lớp"
            name="gradeLevel"
            options={gradeLevels}
            defaultValue={initialData?.gradeLevel || ''}
            placeholder="Chọn cấp lớp"
          />
        </div>

        <ImageUpload
          value={photoUrl}
          onChange={setPhotoUrl}
          category="general"
          label="Ảnh học sinh"
          helpText="Ảnh chân dung của học sinh"
          disabled={loading}
        />
      </div>

      {/* Parent/Guardian Information */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="heading-4">Thông tin phụ huynh</h3>

        <Input
          label="Tên phụ huynh"
          name="parentName"
          defaultValue={initialData?.parentName || ''}
          placeholder="VD: Ông/Bà Nguyễn Văn A"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email phụ huynh"
            name="parentEmail"
            type="email"
            defaultValue={initialData?.parentEmail || ''}
            placeholder="email@example.com"
          />

          <Input
            label="Số điện thoại phụ huynh"
            name="parentPhone"
            type="tel"
            defaultValue={initialData?.parentPhone || ''}
            placeholder="(808) 123-4567"
          />
        </div>

        <Textarea
          label="Địa chỉ"
          name="address"
          rows={2}
          defaultValue={initialData?.address || ''}
          placeholder="Địa chỉ nhà"
        />

        <Input
          label="Liên hệ khẩn cấp"
          name="emergencyContact"
          defaultValue={initialData?.emergencyContact || ''}
          placeholder="Tên và số điện thoại người liên hệ khẩn cấp"
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="heading-4">Thông tin bổ sung</h3>

        <Textarea
          label="Ghi chú"
          name="notes"
          rows={4}
          defaultValue={initialData?.notes || ''}
          placeholder="Ghi chú về học sinh (dị ứng, nhu cầu đặc biệt, v.v.)"
        />

        <Checkbox
          label="Học sinh đang theo học"
          name="isActive"
          defaultChecked={initialData?.isActive !== false}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          {mode === 'create' ? 'Tạo học sinh' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
}
