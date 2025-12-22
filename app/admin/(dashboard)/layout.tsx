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
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <AdminSidebar session={session} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <AdminHeader session={session} />

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 lg:p-6">{children}</main>

        {/* Footer */}
        <footer className="px-6 py-4">
          <p className="text-center text-xs text-gray-400">
            © 2025 Trường Việt Ngữ - Thiếu Nhi Thánh Thể, Honolulu
          </p>
        </footer>
      </div>
    </div>
  );
}
