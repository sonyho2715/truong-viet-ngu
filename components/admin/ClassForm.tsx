'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Class, Teacher } from '@prisma/client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
  createClassAction,
  updateClassAction,
  redirectToClassesList,
} from '@/app/admin/(dashboard)/dashboard/classes/actions';

interface ClassFormProps {
  mode: 'create' | 'edit';
  initialData?: Class;
  teachers: Pick<Teacher, 'id' | 'firstName' | 'lastName'>[];
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

export function ClassForm({ mode, initialData, teachers }: ClassFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classroomImage, setClassroomImage] = useState<string | null>(
    initialData?.classroomImage || null
  );
  const [classPhotoImage, setClassPhotoImage] = useState<string | null>(
    initialData?.classPhotoImage || null
  );

  const teacherOptions = [
    { value: '', label: 'Chưa phân công giáo viên' },
    ...teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.firstName} ${teacher.lastName}`,
    })),
  ];

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    if (classroomImage) {
      formData.set('classroomImage', classroomImage);
    } else {
      formData.delete('classroomImage');
    }

    if (classPhotoImage) {
      formData.set('classPhotoImage', classPhotoImage);
    } else {
      formData.delete('classPhotoImage');
    }

    try {
      const result =
        mode === 'create'
          ? await createClassAction(formData)
          : await updateClassAction(initialData!.id, formData);

      if (result.success) {
        toast.success(
          mode === 'create' ? 'Tạo lớp học thành công' : 'Cập nhật lớp học thành công'
        );
        await redirectToClassesList();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch {
      setError('Có lỗi xảy ra khi lưu lớp học');
      toast.error('Có lỗi xảy ra khi lưu lớp học');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Tên lớp học"
          name="name"
          required
          defaultValue={initialData?.name}
          placeholder="VD: Lớp 1, Mẫu Giáo A..."
        />

        <Select
          label="Cấp lớp"
          name="gradeLevel"
          required
          options={gradeLevels}
          defaultValue={initialData?.gradeLevel}
          placeholder="Chọn cấp lớp"
        />
      </div>

      <Select
        label="Giáo viên phụ trách"
        name="teacherId"
        options={teacherOptions}
        defaultValue={initialData?.teacherId || ''}
        hint="Chọn giáo viên dạy lớp này. Bạn có thể thêm giáo viên mới trong phần Quản lý giáo viên."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Lịch học"
          name="schedule"
          defaultValue={initialData?.schedule || ''}
          placeholder="VD: Chủ Nhật 9:00 AM - 12:00 PM"
        />

        <Input
          label="Số phòng"
          name="roomNumber"
          defaultValue={initialData?.roomNumber || ''}
          placeholder="VD: A101, B205..."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUpload
          value={classroomImage}
          onChange={setClassroomImage}
          category="classrooms"
          label="Ảnh lớp học"
          helpText="Ảnh phòng học hoặc không gian lớp"
          disabled={loading}
        />

        <ImageUpload
          value={classPhotoImage}
          onChange={setClassPhotoImage}
          category="class-photos"
          label="Ảnh tập thể lớp"
          helpText="Ảnh tập thể của lớp học"
          disabled={loading}
        />
      </div>

      <Textarea
        label="Mô tả"
        name="description"
        rows={4}
        defaultValue={initialData?.description || ''}
        placeholder="Mô tả về lớp học..."
      />

      <Input
        label="Thứ tự hiển thị"
        name="displayOrder"
        type="number"
        defaultValue={initialData?.displayOrder || 0}
        min={0}
        hint="Số thứ tự để sắp xếp lớp học (0 = đầu tiên)"
      />

      <Checkbox
        label="Hiển thị lớp học này trên website"
        name="isActive"
        defaultChecked={initialData?.isActive !== false}
      />

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          {mode === 'create' ? 'Tạo lớp học' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
}
