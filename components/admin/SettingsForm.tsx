'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteSetting } from '@prisma/client';
import { updateSettingsAction } from '@/app/admin/(dashboard)/dashboard/settings/actions';

interface SettingsFormProps {
  initialData: SiteSetting;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateSettingsAction(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
          Cài đặt đã được lưu thành công!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>

        <div>
          <label htmlFor="organizationName" className="mb-2 block text-sm font-medium text-gray-700">
            Tên tổ chức <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            required
            defaultValue={initialData.organizationName}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="mb-2 block text-sm font-medium text-gray-700">
            Phụ đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            required
            defaultValue={initialData.subtitle}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium text-gray-700">
            Địa điểm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            defaultValue={initialData.location}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label htmlFor="welcomeMessage" className="mb-2 block text-sm font-medium text-gray-700">
            Thông điệp chào mừng
          </label>
          <textarea
            id="welcomeMessage"
            name="welcomeMessage"
            rows={4}
            defaultValue={initialData.welcomeMessage || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Thông điệp hiển thị trên trang chủ..."
          />
        </div>
      </div>

      {/* Logo & Images */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900">Logo và hình ảnh</h2>

        <div>
          <label htmlFor="leftLogoUrl" className="mb-2 block text-sm font-medium text-gray-700">
            Logo trái (Công đoàn)
          </label>
          <input
            type="url"
            id="leftLogoUrl"
            name="leftLogoUrl"
            defaultValue={initialData.leftLogoUrl || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="https://example.com/logo-left.png"
          />
        </div>

        <div>
          <label htmlFor="rightLogoUrl" className="mb-2 block text-sm font-medium text-gray-700">
            Logo phải (TNTT)
          </label>
          <input
            type="url"
            id="rightLogoUrl"
            name="rightLogoUrl"
            defaultValue={initialData.rightLogoUrl || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="https://example.com/logo-right.png"
          />
        </div>

        <div>
          <label htmlFor="heroBackground" className="mb-2 block text-sm font-medium text-gray-700">
            Hình nền trang chủ
          </label>
          <input
            type="url"
            id="heroBackground"
            name="heroBackground"
            defaultValue={initialData.heroBackground || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="https://example.com/hero-bg.jpg"
          />
        </div>

        <div>
          <label htmlFor="heroBackgroundColor" className="mb-2 block text-sm font-medium text-gray-700">
            Màu nền dự phòng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="heroBackgroundColor"
            name="heroBackgroundColor"
            required
            defaultValue={initialData.heroBackgroundColor}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="#1e3a5f"
          />
          <p className="mt-1 text-xs text-gray-500">Mã màu hex (VD: #1e3a5f)</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin liên hệ</h2>

        <div>
          <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium text-gray-700">
            Email liên hệ
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            defaultValue={initialData.contactEmail || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="mb-2 block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            defaultValue={initialData.contactPhone || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="(808) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            defaultValue={initialData.address || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Địa chỉ đầy đủ của trường..."
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900">Mạng xã hội</h2>

        <div>
          <label htmlFor="facebookUrl" className="mb-2 block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            defaultValue={initialData.facebookUrl || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div>
          <label htmlFor="youtubeUrl" className="mb-2 block text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            defaultValue={initialData.youtubeUrl || ''}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-gold px-6 py-2 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </form>
  );
}
