'use client';

import { useState } from 'react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { FileText, Send, Loader2, CheckCircle } from 'lucide-react';

export default function AbsenceReportPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    absenceDate: '',
    reason: '',
    additionalNotes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/absence-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          studentName: '',
          parentName: '',
          parentEmail: '',
          parentPhone: '',
          absenceDate: '',
          reason: '',
          additionalNotes: '',
        });
      } else {
        setError(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể gửi báo cáo. Vui lòng thử lại.');
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
                Đã Gửi Thành Công!
              </h1>
              <p className="mt-4 text-gray-600">
                Cảm ơn quý phụ huynh đã thông báo. Nhà trường đã nhận được báo cáo
                nghỉ học của con em.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90"
              >
                Gửi báo cáo khác
              </button>
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
          <Breadcrumb items={[{ label: 'Báo Nghỉ Học' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Báo Nghỉ Học
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Vui lòng điền form dưới đây để thông báo con em nghỉ học
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
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Học Sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Parent Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Phụ Huynh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="Nguyễn Văn B"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.parentEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, parentEmail: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, parentPhone: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      placeholder="(808) 123-4567"
                    />
                  </div>
                </div>

                {/* Absence Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày Nghỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.absenceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, absenceDate: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lý Do Nghỉ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="VD: Bị ốm, có việc gia đình..."
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi Chú Thêm
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    placeholder="Thông tin thêm nếu cần..."
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
                    <Send className="h-5 w-5" />
                  )}
                  Gửi Báo Cáo
                </button>
              </div>
            </form>

            {/* Info Note */}
            <div className="mt-8 rounded-xl border-2 border-brand-gold/30 bg-brand-gold/10 p-6">
              <h3 className="font-semibold text-brand-navy">Lưu Ý:</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Vui lòng báo nghỉ trước ít nhất 1 ngày nếu có thể.</li>
                <li>• Nhà trường sẽ ghi nhận và liên hệ nếu cần thêm thông tin.</li>
                <li>• Nếu nghỉ dài hạn, xin liên hệ trực tiếp với giáo viên.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
