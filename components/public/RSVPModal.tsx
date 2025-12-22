'use client';

import { useState } from 'react';
import { X, CheckCircle, Users } from 'lucide-react';

interface RSVPModalProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  maxAttendees?: number | null;
  currentCount?: number;
  onClose: () => void;
}

export function RSVPModal({
  eventId,
  eventTitle,
  eventDate,
  maxAttendees,
  currentCount = 0,
  onClose,
}: RSVPModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    dietaryNeeds: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
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

  const spotsLeft = maxAttendees ? maxAttendees - currentCount : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
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
              Đăng ký thành công!
            </h2>
            <p className="mt-2 text-gray-600">
              Cảm ơn bạn đã đăng ký tham dự <strong>{eventTitle}</strong>.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Chúng tôi sẽ gửi email xác nhận đến {formData.email}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg bg-slate-900 px-6 py-2 font-semibold text-white hover:bg-slate-900/90"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Đăng ký tham dự
              </h2>
              <p className="mt-1 text-lg font-medium text-slate-900">{eventTitle}</p>
              <p className="text-sm text-gray-500">{eventDate}</p>
              {spotsLeft !== null && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className={spotsLeft <= 5 ? 'font-medium text-orange-600' : 'text-gray-600'}>
                    Còn {spotsLeft} chỗ
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số người tham dự <span className="text-red-500">*</span>
                </label>
                <select
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'người' : 'người'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yêu cầu ăn uống đặc biệt
                </label>
                <input
                  type="text"
                  name="dietaryNeeds"
                  value={formData.dietaryNeeds}
                  onChange={handleChange}
                  placeholder="Dị ứng, ăn chay, etc."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú thêm
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-slate-900 hover:bg-yellow-400/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
