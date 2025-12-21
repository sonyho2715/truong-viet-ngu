'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ParentSessionData } from '@/lib/parent-auth';
import { Menu, X, LogOut, User, Home, Users, Calendar, BookOpen, FileText, Bell } from 'lucide-react';

interface ParentHeaderProps {
  parent: ParentSessionData;
}

const mobileNavigation = [
  { name: 'Tổng quan', href: '/parent/dashboard', icon: Home },
  { name: 'Học sinh', href: '/parent/students', icon: Users },
  { name: 'Điểm danh', href: '/parent/attendance', icon: Calendar },
  { name: 'Điểm số', href: '/parent/grades', icon: BookOpen },
  { name: 'Phiếu liên lạc', href: '/parent/reports', icon: FileText },
  { name: 'Thông báo', href: '/parent/announcements', icon: Bell },
  { name: 'Hồ sơ', href: '/parent/profile', icon: User },
];

export function ParentHeader({ parent }: ParentHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/parent/logout', { method: 'POST' });
      router.push('/parent/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {parent.lastName} {parent.firstName}
            </p>
            <p className="text-xs text-gray-500">Phụ huynh</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
                  <span className="font-serif text-lg font-bold text-brand-navy">TV</span>
                </div>
                <div>
                  <h1 className="font-serif text-base font-bold text-brand-navy">
                    Trường Việt Ngữ
                  </h1>
                  <p className="text-xs text-gray-500">Cổng phụ huynh</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {mobileNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">
                  {parent.lastName} {parent.firstName}
                </p>
                <p className="text-xs text-gray-500">{parent.email}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
