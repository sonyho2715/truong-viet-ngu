'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { UserPlus, Mail, Phone, User, Lock, Loader2, CheckCircle, FileText } from 'lucide-react';

export default function TeacherRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          bio: formData.bio,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navigation />
        <main className="px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-xl bg-white p-12 shadow-lg">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-6 font-serif text-3xl font-bold text-gray-900">
                Đăng Ký Thành Công!
              </h1>
              <p className="mt-4 text-gray-600">
                Cảm ơn bạn đã đăng ký làm giáo viên. Tài khoản của bạn đang chờ
                được phê duyệt bởi ban quản trị. Chúng tôi sẽ liên hệ với bạn
                qua email khi tài khoản được kích hoạt.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 py-16 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Đăng Ký Giáo Viên' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <UserPlus className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Đăng Ký Giáo Viên
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Tham gia đội ngũ giáo viên Trường Việt Ngữ
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-white p-8 shadow-lg"
            >
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <User className="mb-1 inline h-4 w-4" /> Họ{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="Nguyễn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="Văn A"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="mb-1 inline h-4 w-4" /> Email{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Phone className="mb-1 inline h-4 w-4" /> Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="(808) 123-4567"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Lock className="mb-1 inline h-4 w-4" /> Mật Khẩu{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="Ít nhất 8 ký tự"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <FileText className="mb-1 inline h-4 w-4" /> Giới Thiệu Bản
                    Thân
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="Kinh nghiệm giảng dạy, chuyên môn..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 py-4 font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <UserPlus className="h-5 w-5" />
                  )}
                  Đăng Ký
                </button>

                <p className="text-center text-sm text-gray-500">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login/teacher"
                    className="text-brand-navy hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
