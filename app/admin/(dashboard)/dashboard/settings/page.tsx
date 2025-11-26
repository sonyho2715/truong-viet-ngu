import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata = {
  title: 'Cài đặt website | Trang quản trị',
};

export default async function SettingsPage() {
  // Get or create site settings
  let settings = await db.siteSetting.findUnique({
    where: { id: 'site_settings' },
  });

  // Create default settings if they don't exist
  if (!settings) {
    settings = await db.siteSetting.create({
      data: {
        id: 'site_settings',
        organizationName: 'Trường Việt Ngữ',
        subtitle: 'Thiếu Nhi Thánh Thể',
        location: 'Honolulu, HI',
        heroBackgroundColor: '#1e3a5f',
      },
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Cài đặt website</h1>
        <p className="mt-2 text-gray-600">
          Quản lý thông tin chung của website
        </p>
      </div>

      {/* Settings Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
