'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'light' | 'dark';
}

export function NewsletterSignup({ variant = 'light' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
      } else {
        setError(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = variant === 'dark';

  if (success) {
    return (
      <div
        className={`rounded-xl p-6 text-center ${
          isDark ? 'bg-white/10' : 'bg-brand-gold/10'
        }`}
      >
        <CheckCircle
          className={`mx-auto h-12 w-12 ${
            isDark ? 'text-brand-gold' : 'text-green-500'
          }`}
        />
        <p
          className={`mt-4 font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Cảm ơn bạn đã đăng ký!
        </p>
        <p
          className={`mt-1 text-sm ${
            isDark ? 'text-brand-cream/80' : 'text-gray-600'
          }`}
        >
          Bạn sẽ nhận được tin tức mới nhất từ trường.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Mail className={`h-5 w-5 ${isDark ? 'text-brand-gold' : 'text-brand-navy'}`} />
        <h3
          className={`font-semibold ${isDark ? 'text-white' : 'text-brand-navy'}`}
        >
          Nhận Tin Tức
        </h3>
      </div>
      <p
        className={`mt-2 text-sm ${
          isDark ? 'text-brand-cream/80' : 'text-gray-600'
        }`}
      >
        Đăng ký để nhận thông báo về sự kiện và tin tức mới nhất.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error && (
          <div className="rounded-lg bg-red-100 p-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ và tên"
          className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
            isDark
              ? 'border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-brand-gold'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-brand-navy/20'
          }`}
        />

        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className={`flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
              isDark
                ? 'border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-brand-gold'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-brand-navy/20'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              isDark
                ? 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
                : 'bg-brand-navy text-white hover:bg-brand-navy/90'
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Đăng ký'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
