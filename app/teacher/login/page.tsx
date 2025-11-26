'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/teacher/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream shadow-lg">
                <span className="font-serif text-3xl font-bold text-brand-navy">
                  TV
                </span>
              </div>
            </Link>
            <h1 className="mt-4 font-serif text-3xl font-bold text-white">
              Cổng Giáo Viên
            </h1>
            <p className="mt-2 text-brand-cream/80">
              Đăng nhập để quản lý lớp học của bạn
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Đăng Nhập
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-sm text-gray-500">hoặc</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Register Link */}
            <Link
              href="/register/teacher"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-navy px-4 py-3 font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
            >
              <UserPlus className="h-5 w-5" />
              Đăng Ký Tài Khoản Mới
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-brand-cream/80 hover:text-white"
            >
              &larr; Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
