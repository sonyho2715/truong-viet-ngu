import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Trang quản trị | Trường Việt Ngữ',
  description: 'Trang quản trị nội dung website',
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication
  const session = await getSession();
  if (!session.isLoggedIn || !session.adminId) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar session={session} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <AdminHeader session={session} />

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Trường Việt Ngữ - Thiếu Nhi Thánh Thể, Honolulu, HI
          </p>
        </footer>
      </div>
    </div>
  );
}
