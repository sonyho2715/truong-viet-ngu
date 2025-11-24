'use client';

import { useTransition, useState } from 'react';
import { loginAction, redirectToDashboard } from '@/app/admin/login/actions';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setError('');

    startTransition(async () => {
      const result = await loginAction(formData);

      if (result.success) {
        // Redirect to dashboard
        await redirectToDashboard();
      } else {
        setError(result.error || 'Đã xảy ra lỗi');
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          autoComplete="email"
          placeholder="admin@truongvietngu.com"
          className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          disabled={isPending}
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1.5 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-brand-gold px-6 py-3.5 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Đang đăng nhập...
          </span>
        ) : (
          'Đăng nhập'
        )}
      </button>

      {/* Default Credentials Hint (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-800">
            <strong>Mặc định:</strong> admin@truongvietngu.com / Admin123!
          </p>
        </div>
      )}
    </form>
  );
}
