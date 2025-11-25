'use client';

import { useTransition, useState } from 'react';
import { loginAction, redirectToDashboard } from '@/app/admin/login/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
        <div className="rounded-lg border-2 border-error/20 bg-error/10 p-4" role="alert">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-error-dark">{error}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <Input
        label="Email"
        type="email"
        name="email"
        required
        disabled={isPending}
        autoComplete="email"
        placeholder="admin@truongvietngu.com"
      />

      {/* Password Field */}
      <Input
        label="Mật khẩu"
        type="password"
        name="password"
        required
        disabled={isPending}
        autoComplete="current-password"
        placeholder="••••••••"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        className="w-full"
      >
        Đăng nhập
      </Button>

      {/* Default Credentials Hint (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="rounded-lg border border-info/20 bg-info/10 p-3">
          <p className="text-xs text-info-dark">
            <strong>Mặc định:</strong> admin@truongvietngu.com / Admin123!
          </p>
        </div>
      )}
    </form>
  );
}
