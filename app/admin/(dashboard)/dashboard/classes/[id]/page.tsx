import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ClassForm } from '@/components/admin/ClassForm';
import { DeleteClassButton } from '@/components/admin/DeleteClassButton';

export const metadata = {
  title: 'Chỉnh sửa lớp học | Trang quản trị',
};

interface EditClassPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const { id } = await params;

  const classData = await db.class.findUnique({
    where: { id },
  });

  if (!classData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Chỉnh sửa lớp học
          </h1>
          <p className="mt-2 text-gray-600">Cập nhật thông tin lớp học</p>
        </div>
        <DeleteClassButton classId={classData.id} className={classData.name} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <ClassForm mode="edit" initialData={classData} />
      </div>
    </div>
  );
}
