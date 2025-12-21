'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, GraduationCap, Users } from 'lucide-react';

export default function ParentLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/parent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
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
            Cổng Thông Tin Phụ Huynh
          </h1>
          <p className="mt-4 text-lg text-brand-cream">
            Theo dõi tiến trình học tập của con em, xem điểm danh, điểm số và thông báo từ nhà trường.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-brand-gold">Điểm danh</p>
              <p className="text-sm text-brand-cream">Theo dõi chuyên cần</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-brand-gold">Điểm số</p>
              <p className="text-sm text-brand-cream">Xem kết quả học tập</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
              <Users className="h-8 w-8 text-brand-navy" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-navy">
              Cổng Thông Tin Phụ Huynh
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-center font-serif text-2xl font-bold text-gray-900">
              Đăng Nhập
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="Nhập mật khẩu"
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
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/parent/register" className="font-medium text-brand-navy hover:underline">
                  Đăng ký ngay
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
