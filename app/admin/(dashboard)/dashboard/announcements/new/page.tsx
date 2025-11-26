import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AnnouncementForm } from '@/components/admin/AnnouncementForm';

export const metadata = {
  title: 'Tạo thông báo mới | Trang quản trị',
};

export default function NewAnnouncementPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Tạo thông báo mới</h1>
        <p className="mt-2 text-gray-600">
          Thêm thông báo mới cho học sinh và phụ huynh
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <AnnouncementForm mode="create" />
      </div>
    </div>
  );
}
