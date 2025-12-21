'use client';

import { useState } from 'react';
import { X, CheckCircle, HandHeart } from 'lucide-react';

interface VolunteerSignupButtonProps {
  opportunityId: string;
  opportunityTitle: string;
}

export function VolunteerSignupButton({
  opportunityId,
  opportunityTitle,
}: VolunteerSignupButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (isSubmitted) {
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
      });
      setIsSubmitted(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
      >
        <HandHeart className="h-4 w-4" />
        Đăng ký
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  Cảm ơn bạn!
                </h2>
                <p className="mt-2 text-gray-600">
                  Đăng ký của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white hover:bg-brand-navy/90"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    Đăng Ký Tình Nguyện
                  </h2>
                  <p className="mt-1 text-brand-navy">{opportunityTitle}</p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                        required
                      />
                    </div>
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
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Kinh nghiệm, câu hỏi, hoặc thông tin bổ sung..."
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-lg bg-brand-gold px-4 py-2 font-semibold text-brand-navy hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
