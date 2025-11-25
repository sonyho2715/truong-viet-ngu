import { StudentForm } from '@/components/admin/StudentForm';

export const metadata = {
  title: 'Thêm học sinh mới | Trang quản trị',
};

export default function NewStudentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Thêm học sinh mới</h1>
        <p className="mt-2 text-gray-600">Tạo hồ sơ học sinh mới</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <StudentForm mode="create" />
      </div>
    </div>
  );
}
