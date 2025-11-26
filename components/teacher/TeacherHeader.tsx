'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  LogOut,
  UserCircle,
  Home,
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
} from 'lucide-react';
import type { TeacherSessionData } from '@/lib/teacher-auth';

interface TeacherHeaderProps {
  teacher: TeacherSessionData;
}

const mobileNavigation = [
  { name: 'Tổng quan', href: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Lớp của tôi', href: '/teacher/classes', icon: BookOpen },
  { name: 'Học sinh', href: '/teacher/students', icon: Users },
  { name: 'Lịch dạy', href: '/teacher/schedule', icon: Calendar },
  { name: 'Tài liệu', href: '/teacher/materials', icon: FileText },
  { name: 'Hồ sơ cá nhân', href: '/teacher/profile', icon: UserCircle },
];

export function TeacherHeader({ teacher }: TeacherHeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/teacher/logout', { method: 'POST' });
      router.push('/teacher/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Left - Welcome Message (Desktop) */}
        <div className="hidden lg:block">
          <p className="text-sm text-gray-600">
            Xin chào,{' '}
            <span className="font-semibold text-brand-navy">
              {teacher.firstName} {teacher.lastName}
            </span>
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* View Website Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Xem trang web</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
                  <span className="font-serif text-lg font-bold text-brand-navy">
                    TV
                  </span>
                </div>
                <span className="font-serif font-bold text-brand-navy">
                  Cổng Giáo Viên
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="border-b border-gray-200 p-4">
              <p className="font-semibold text-gray-900">
                {teacher.firstName} {teacher.lastName}
              </p>
              <p className="text-sm text-gray-500">{teacher.email}</p>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              {mobileNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
