import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MaterialForm } from '@/components/admin/MaterialForm';

export const metadata = {
  title: 'Tạo tài liệu mới | Trang quản trị',
};

export default function NewMaterialPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Tạo tài liệu học tập mới</h1>
        <p className="mt-2 text-gray-600">Thêm tài liệu học tập mới cho các lớp</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <MaterialForm mode="create" />
      </div>
    </div>
  );
}
