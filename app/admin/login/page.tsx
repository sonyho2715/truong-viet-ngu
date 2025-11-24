import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Đăng nhập - Quản trị viên | Trường Việt Ngữ',
  description: 'Trang đăng nhập dành cho quản trị viên',
};

export default async function AdminLoginPage() {
  // Check if already logged in
  const session = await getSession();
  if (session.isLoggedIn && session.adminId) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90 px-4 py-12">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23D4AF37' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream shadow-2xl">
            <span className="font-serif text-4xl font-bold text-brand-navy">TV</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-gold">Trường Việt Ngữ</h1>
          <p className="mt-2 text-brand-cream/80">Trang quản trị viên</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border-2 border-brand-gold/30 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-brand-navy">Đăng nhập</h2>
            <p className="mt-1 text-sm text-gray-600">Nhập thông tin để truy cập trang quản trị</p>
          </div>

          <LoginForm />

          {/* Footer Note */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-center text-xs text-gray-500">
              Dành cho quản trị viên của Trường Việt Ngữ
              <br />
              Thiếu Nhi Thánh Thể - Honolulu, HI
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-cream/80 transition-colors hover:text-brand-gold"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
