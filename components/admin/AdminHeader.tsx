'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';
import type { SessionData } from '@/lib/auth';

interface AdminHeaderProps {
  session: SessionData;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutAction();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Page Title - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* View Site Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="hidden sm:inline">Xem website</span>
          </Link>

          {/* Logout Button */}
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white p-4 lg:hidden">
          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tổng quan
            </Link>
            <Link
              href="/admin/dashboard/announcements"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thông báo
            </Link>
            <Link
              href="/admin/dashboard/classes"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lớp học
            </Link>
            <Link
              href="/admin/dashboard/materials"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tài liệu học tập
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cài đặt website
            </Link>
          </nav>

          {/* Mobile User Info */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-900">{session.name}</p>
            <p className="text-xs text-gray-500">{session.email}</p>
          </div>
        </div>
      )}
    </header>
  );
}
