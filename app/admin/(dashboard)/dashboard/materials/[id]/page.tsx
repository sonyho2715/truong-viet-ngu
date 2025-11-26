import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MaterialForm } from '@/components/admin/MaterialForm';
import { DeleteMaterialButton } from '@/components/admin/DeleteMaterialButton';

export const metadata = {
  title: 'Chỉnh sửa tài liệu | Trang quản trị',
};

interface EditMaterialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const { id } = await params;

  const material = await db.learningMaterial.findUnique({
    where: { id },
  });

  if (!material) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Chỉnh sửa tài liệu
          </h1>
          <p className="mt-2 text-gray-600">Cập nhật thông tin tài liệu học tập</p>
        </div>
        <DeleteMaterialButton materialId={material.id} materialTitle={material.title} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <MaterialForm mode="edit" initialData={material} />
      </div>
    </div>
  );
}
