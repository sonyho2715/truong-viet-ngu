'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Users, CheckCircle2 } from 'lucide-react';

export default function ParentRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    studentCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/parent/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      router.push('/parent/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/90 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream">
            <Users className="h-10 w-10 text-brand-navy" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white">
            Đăng Ký Tài Khoản Phụ Huynh
          </h1>
          <p className="mt-4 text-lg text-brand-cream">
            Tạo tài khoản để theo dõi tiến trình học tập của con em tại Trường Việt Ngữ.
          </p>
          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-center gap-3 text-brand-cream">
              <CheckCircle2 className="h-5 w-5 text-brand-gold" />
              <span>Xem lịch học và thông báo</span>
            </div>
            <div className="flex items-center gap-3 text-brand-cream">
              <CheckCircle2 className="h-5 w-5 text-brand-gold" />
              <span>Theo dõi điểm danh hàng tuần</span>
            </div>
            <div className="flex items-center gap-3 text-brand-cream">
              <CheckCircle2 className="h-5 w-5 text-brand-gold" />
              <span>Xem điểm số và phiếu liên lạc</span>
            </div>
            <div className="flex items-center gap-3 text-brand-cream">
              <CheckCircle2 className="h-5 w-5 text-brand-gold" />
              <span>Liên lạc với giáo viên</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
              <Users className="h-8 w-8 text-brand-navy" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-navy">
              Đăng Ký Tài Khoản
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-center font-serif text-2xl font-bold text-gray-900 lg:block hidden">
              Đăng Ký
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Họ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="Nguyễn"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="email@example.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Sử dụng email đã đăng ký với nhà trường để tự động liên kết hồ sơ học sinh
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="(808) 123-4567"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="Ít nhất 6 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mã học sinh (tùy chọn)
                </label>
                <input
                  type="text"
                  value={formData.studentCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, studentCode: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Nếu có, nhập mã để liên kết hồ sơ"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-3 font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/parent/login" className="font-medium text-brand-navy hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-brand-navy">
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
