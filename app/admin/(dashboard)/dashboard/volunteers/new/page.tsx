import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Thêm cơ hội tình nguyện | Trang quản trị',
};

async function createOpportunity(formData: FormData) {
  'use server';

  await requireAuth();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateStr = formData.get('date') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const location = formData.get('location') as string;
  const spotsAvailable = formData.get('spotsAvailable') as string;
  const requirements = formData.get('requirements') as string;
  const contactName = formData.get('contactName') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const isActive = formData.get('isActive') === 'on';

  await db.volunteerOpportunity.create({
    data: {
      title,
      description,
      date: dateStr ? new Date(dateStr) : null,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location || null,
      spotsAvailable: spotsAvailable ? parseInt(spotsAvailable, 10) : null,
      requirements: requirements || null,
      contactName: contactName || null,
      contactEmail: contactEmail || null,
      isActive,
    },
  });

  revalidatePath('/admin/dashboard/volunteers');
  redirect('/admin/dashboard/volunteers');
}

export default async function NewVolunteerPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/volunteers"
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Thêm cơ hội tình nguyện</h1>
          <p className="mt-1 text-gray-600">Tạo cơ hội tình nguyện mới cho cộng đồng</p>
        </div>
      </div>

      <form action={createOpportunity} className="max-w-2xl space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Thông tin cơ bản</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                placeholder="VD: Dọn dẹp nhà thờ"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                placeholder="Mô tả chi tiết về công việc tình nguyện..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                  Ngày
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                />
              </div>
              <div>
                <label htmlFor="startTime" className="mb-1 block text-sm font-medium text-gray-700">
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="mb-1 block text-sm font-medium text-gray-700">
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                  Địa điểm
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="VD: Nhà thờ St. Patrick"
                />
              </div>
              <div>
                <label htmlFor="spotsAvailable" className="mb-1 block text-sm font-medium text-gray-700">
                  Số chỗ
                </label>
                <input
                  type="number"
                  id="spotsAvailable"
                  name="spotsAvailable"
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="mb-1 block text-sm font-medium text-gray-700">
                Yêu cầu
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                placeholder="VD: Trên 16 tuổi, mang giày thoải mái..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Thông tin liên hệ</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactName" className="mb-1 block text-sm font-medium text-gray-700">
                Tên người liên hệ
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-gray-700">
                Email liên hệ
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="h-5 w-5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
            />
            <span className="font-medium text-gray-900">Đang mở đăng ký</span>
          </label>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/dashboard/volunteers"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90"
          >
            Tạo cơ hội
          </button>
        </div>
      </form>
    </div>
  );
}
