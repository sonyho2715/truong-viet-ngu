'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Youtube,
} from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi gửi tin nhắn');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              Cảm ơn bạn đã liên hệ!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/"
                className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-900/90"
              >
                Về trang chủ
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                  });
                }}
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Gửi tin nhắn khác
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold">Liên Hệ</h1>
          <p className="mt-4 text-lg text-yellow-400">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-gray-900">
                Thông tin liên hệ
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-900/10 p-3">
                    <MapPin className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Địa chỉ</p>
                    <p className="text-gray-600">
                      Nhà thờ Cộng đoàn Công giáo Việt Nam
                      <br />
                      Honolulu, Hawaii
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-900/10 p-3">
                    <Mail className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:contact@truongvietngu.org"
                      className="text-slate-900 hover:underline"
                    >
                      contact@truongvietngu.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-900/10 p-3">
                    <Phone className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Điện thoại</p>
                    <a href="tel:+18081234567" className="text-slate-900 hover:underline">
                      (808) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-900/10 p-3">
                    <Clock className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Giờ học</p>
                    <p className="text-gray-600">
                      Chủ Nhật: 9:00 AM - 11:30 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-gray-900">
                Kết nối với chúng tôi
              </h2>
              <div className="mt-4 flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl bg-slate-900/5 p-6">
              <h2 className="font-serif text-xl font-bold text-gray-900">
                Liên kết nhanh
              </h2>
              <div className="mt-4 space-y-2">
                <Link
                  href="/register"
                  className="block text-slate-900 hover:underline"
                >
                  → Đăng ký học sinh mới
                </Link>
                <Link href="/faq" className="block text-slate-900 hover:underline">
                  → Câu hỏi thường gặp
                </Link>
                <Link
                  href="/calendar"
                  className="block text-slate-900 hover:underline"
                >
                  → Lịch sự kiện
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="mt-2 text-gray-600">
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>

              {error && (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chủ đề <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="Đăng ký học">Đăng ký học</option>
                      <option value="Thông tin lớp học">Thông tin lớp học</option>
                      <option value="TNTT">Chương trình TNTT</option>
                      <option value="Tình nguyện">Tình nguyện viên</option>
                      <option value="Đóng góp">Đóng góp / Ủng hộ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tin nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-8 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Đang gửi...'
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
