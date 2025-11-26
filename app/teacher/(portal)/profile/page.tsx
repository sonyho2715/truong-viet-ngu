'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Save, Eye, EyeOff, Lock } from 'lucide-react';

interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function TeacherProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    photoUrl: '',
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/teacher/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phone: data.data.phone || '',
          bio: data.data.bio || '',
          photoUrl: data.data.photoUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
        setProfile(data.data);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Cập nhật thất bại' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/teacher/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Đổi mật khẩu thất bại' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('category', 'TEACHER');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, photoUrl: data.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
        <p className="mt-1 text-sm text-gray-600">
          Cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
        {/* Photo Upload */}
        <div className="mb-6 flex items-center gap-6">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100">
              {formData.photoUrl ? (
                <Image
                  src={formData.photoUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-brand-navy text-2xl font-bold text-white">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-brand-navy p-2 text-white shadow-lg hover:bg-brand-navy/90">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ảnh đại diện</h3>
            <p className="text-sm text-gray-500">
              Nhấn vào biểu tượng camera để thay đổi
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              placeholder="(808) 123-4567"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Giới thiệu bản thân
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            placeholder="Chia sẻ về kinh nghiệm giảng dạy của bạn..."
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
          >
            {saving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Lưu thay đổi
          </button>
        </div>
      </form>

      {/* Password Change Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Đổi mật khẩu</h2>
            <p className="text-sm text-gray-500">
              Cập nhật mật khẩu đăng nhập của bạn
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Lock className="h-4 w-4" />
            {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
              >
                {saving ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="rounded-xl bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-700">Thông tin tài khoản</h3>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Ngày tạo:</span>{' '}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('vi-VN')
              : 'N/A'}
          </p>
          <p>
            <span className="font-medium">Đăng nhập lần cuối:</span>{' '}
            {profile?.lastLoginAt
              ? new Date(profile.lastLoginAt).toLocaleString('vi-VN')
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
