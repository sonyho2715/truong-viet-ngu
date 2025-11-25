'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher } from '@prisma/client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createTeacherAction, updateTeacherAction, redirectToTeachersList } from '@/app/admin/(dashboard)/dashboard/teachers/actions';

interface TeacherFormProps {
  mode: 'create' | 'edit';
  initialData?: Teacher;
}

export function TeacherForm({ mode, initialData }: TeacherFormProps) {
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
          ? await createTeacherAction(formData)
          : await updateTeacherAction(initialData!.id, formData);

      if (result.success) {
        toast.success(
          mode === 'create' ? 'Tạo giáo viên thành công' : 'Cập nhật giáo viên thành công'
        );
        await redirectToTeachersList();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch {
      setError('Có lỗi xảy ra khi lưu giáo viên');
      toast.error('Có lỗi xảy ra khi lưu giáo viên');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-error/10 p-4 text-sm text-error-dark" role="alert">
          {error}
        </div>
      )}

      {/* First Name */}
      <Input
        label="Tên"
        name="firstName"
        type="text"
        required
        defaultValue={initialData?.firstName}
      />

      {/* Last Name */}
      <Input
        label="Họ"
        name="lastName"
        type="text"
        required
        defaultValue={initialData?.lastName}
      />

      {/* Email */}
      <Input
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={initialData?.email}
      />

      {/* Phone */}
      <Input
        label="Số điện thoại"
        name="phone"
        type="tel"
        defaultValue={initialData?.phone || ''}
        placeholder="(808) 123-4567"
      />

      {/* Photo Upload */}
      <div>
        <ImageUpload
          value={photoUrl}
          onChange={setPhotoUrl}
          category="teachers"
          label="Ảnh đại diện"
          helpText="Ảnh chân dung của giáo viên"
          disabled={loading}
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-medium text-gray-700">
          Giới thiệu
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initialData?.bio || ''}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          placeholder="Giới thiệu về giáo viên..."
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          defaultChecked={initialData?.isActive ?? true}
          className="h-5 w-5 rounded border-gray-300 text-brand-gold focus:ring-2 focus:ring-brand-gold"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Đang hoạt động
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/dashboard/teachers')}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          {mode === 'create' ? 'Tạo giáo viên' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
}
