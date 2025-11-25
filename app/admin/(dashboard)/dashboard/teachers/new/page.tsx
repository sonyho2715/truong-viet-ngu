import { TeacherForm } from '@/components/admin/TeacherForm';

export const metadata = {
  title: 'Thêm giáo viên mới | Trang quản trị',
};

export default function NewTeacherPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Thêm giáo viên mới</h1>
        <p className="mt-2 text-gray-600">Tạo hồ sơ giáo viên mới cho trường</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <TeacherForm mode="create" />
      </div>
    </div>
  );
}
