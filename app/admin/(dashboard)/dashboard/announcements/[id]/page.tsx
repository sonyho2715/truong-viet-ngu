import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AnnouncementForm } from '@/components/admin/AnnouncementForm';

export const metadata = {
  title: 'Chỉnh sửa thông báo | Trang quản trị',
};

interface EditAnnouncementPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAnnouncementPage({
  params,
}: EditAnnouncementPageProps) {
  const { id } = await params;

  const announcement = await db.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Chỉnh sửa thông báo</h1>
        <p className="mt-2 text-gray-600">Cập nhật thông tin thông báo</p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <AnnouncementForm mode="edit" announcement={announcement} />
      </div>
    </div>
  );
}
