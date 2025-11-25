import { db } from '@/lib/db';
import { ClassForm } from '@/components/admin/ClassForm';

export const metadata = {
  title: 'Tạo lớp học mới | Trang quản trị',
};

export default async function NewClassPage() {
  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Tạo lớp học mới</h1>
        <p className="mt-2 text-gray-600">Thêm lớp học mới cho trường Việt Ngữ và TNTT</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <ClassForm mode="create" teachers={teachers} />
      </div>
    </div>
  );
}
