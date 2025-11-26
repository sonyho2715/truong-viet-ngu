import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { TeacherForm } from '@/components/admin/TeacherForm';
import { DeleteTeacherButton } from '@/components/admin/DeleteTeacherButton';

export const metadata = {
  title: 'Chỉnh sửa giáo viên | Trang quản trị',
};

interface EditTeacherPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  const { id } = await params;

  const teacher = await db.teacher.findUnique({
    where: { id },
    include: {
      classes: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!teacher) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Chỉnh sửa giáo viên
          </h1>
          <p className="mt-2 text-gray-600">
            Cập nhật thông tin cho {teacher.firstName} {teacher.lastName}
          </p>
          {teacher.classes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Đang dạy {teacher.classes.length} lớp:
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {teacher.classes.map((cls) => (
                  <span
                    key={cls.id}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {cls.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <DeleteTeacherButton
          teacherId={teacher.id}
          teacherName={`${teacher.firstName} ${teacher.lastName}`}
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <TeacherForm mode="edit" initialData={teacher} />
      </div>
    </div>
  );
}
