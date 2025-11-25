'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Announcement } from '@prisma/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  redirectToAnnouncementsList,
} from '@/app/admin/(dashboard)/dashboard/announcements/actions';

interface AnnouncementFormProps {
  mode: 'create' | 'edit';
  announcement?: Announcement;
}

const categories = [
  { value: 'CHOIR', label: 'Ca đoàn TNTT' },
  { value: 'BIBLE', label: 'Đọc Sách Thánh' },
  { value: 'EVENT', label: 'Sự kiện' },
  { value: 'GENERAL', label: 'Thông báo chung' },
  { value: 'HOLIDAY', label: 'Nghỉ lễ' },
];

export function AnnouncementForm({ mode, announcement }: AnnouncementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setError('');

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createAnnouncementAction(formData)
          : await updateAnnouncementAction(announcement!.id, formData);

      if (result?.success) {
        toast.success(
          mode === 'create' ? 'Tạo thông báo thành công' : 'Cập nhật thông báo thành công'
        );
        await redirectToAnnouncementsList();
      } else {
        setError(result?.error || 'Đã xảy ra lỗi');
        toast.error(result?.error || 'Đã xảy ra lỗi');
      }
    });
  }

  function formatDateForInput(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      <Input
        label="Tiêu đề"
        name="title"
        required
        disabled={isPending}
        defaultValue={announcement?.title}
        placeholder="Ví dụ: Thông báo nghỉ lễ Tết Nguyên Đán"
      />

      <Select
        label="Danh mục"
        name="category"
        required
        disabled={isPending}
        options={categories}
        defaultValue={announcement?.category}
        placeholder="Chọn danh mục"
      />

      <Textarea
        label="Nội dung"
        name="description"
        required
        disabled={isPending}
        defaultValue={announcement?.description}
        rows={6}
        placeholder="Nhập nội dung thông báo..."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Ngày bắt đầu"
          name="startDate"
          type="date"
          required
          disabled={isPending}
          defaultValue={formatDateForInput(announcement?.startDate || new Date())}
        />

        <Input
          label="Ngày kết thúc"
          name="endDate"
          type="date"
          disabled={isPending}
          defaultValue={formatDateForInput(announcement?.endDate || null)}
          hint="Tùy chọn"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Mức độ ưu tiên"
          name="priority"
          type="number"
          min={0}
          max={10}
          disabled={isPending}
          defaultValue={announcement?.priority || 0}
          hint="Số càng cao càng ưu tiên (0-10)"
        />

        <div className="flex items-end pb-1">
          <Checkbox
            label="Hiển thị"
            description="Công khai thông báo này"
            name="isActive"
            disabled={isPending}
            defaultChecked={announcement?.isActive ?? true}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending}>
          {mode === 'create' ? 'Tạo thông báo' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
}
