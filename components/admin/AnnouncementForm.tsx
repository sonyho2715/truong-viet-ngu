'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Announcement } from '@prisma/client';
import { toast } from 'sonner';
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

  // Format date for input (YYYY-MM-DD)
  function formatDateForInput(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
          Tiêu đề <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          disabled={isPending}
          defaultValue={announcement?.title}
          placeholder="Ví dụ: Thông báo nghỉ lễ Tết Nguyên Đán"
          className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
          Danh mục <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          disabled={isPending}
          defaultValue={announcement?.category}
          className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
          Nội dung <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          disabled={isPending}
          defaultValue={announcement?.description}
          rows={6}
          placeholder="Nhập nội dung thông báo..."
          className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Date Range */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
            Ngày bắt đầu <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            disabled={isPending}
            defaultValue={formatDateForInput(announcement?.startDate || new Date())}
            className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">
            Ngày kết thúc <span className="text-gray-500 text-xs">(Tùy chọn)</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            disabled={isPending}
            defaultValue={formatDateForInput(announcement?.endDate || null)}
            className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Priority & Status */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
            Mức độ ưu tiên
          </label>
          <input
            type="number"
            id="priority"
            name="priority"
            min="0"
            max="10"
            disabled={isPending}
            defaultValue={announcement?.priority || 0}
            className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">Số càng cao càng ưu tiên (0-10)</p>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-lg border-2 border-gray-300 px-4 py-3 transition-all hover:border-brand-gold">
            <input
              type="checkbox"
              name="isActive"
              disabled={isPending}
              defaultChecked={announcement?.isActive ?? true}
              className="h-5 w-5 rounded border-gray-300 text-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div>
              <span className="block text-sm font-semibold text-gray-700">Hiển thị</span>
              <span className="block text-xs text-gray-500">Công khai thông báo này</span>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đang lưu...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {mode === 'create' ? 'Tạo thông báo' : 'Cập nhật'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
