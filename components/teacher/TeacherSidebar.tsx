'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCircle,
  Calendar,
  FileText,
} from 'lucide-react';
import type { TeacherSessionData } from '@/lib/teacher-auth';

interface TeacherSidebarProps {
  teacher: TeacherSessionData;
}

const navigation = [
  {
    name: 'Tổng quan',
    href: '/teacher/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Lớp của tôi',
    href: '/teacher/classes',
    icon: BookOpen,
  },
  {
    name: 'Học sinh',
    href: '/teacher/students',
    icon: Users,
  },
  {
    name: 'Lịch dạy',
    href: '/teacher/schedule',
    icon: Calendar,
  },
  {
    name: 'Tài liệu',
    href: '/teacher/materials',
    icon: FileText,
  },
  {
    name: 'Hồ sơ cá nhân',
    href: '/teacher/profile',
    icon: UserCircle,
  },
];

export function TeacherSidebar({ teacher }: TeacherSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
              <span className="font-serif text-lg font-bold text-brand-navy">
                TV
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-base font-bold text-brand-navy">
                Cổng Giáo Viên
              </h1>
              <p className="truncate text-xs text-gray-500">Trường Việt Ngữ</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-gold text-brand-navy'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-brand-navy'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-700">
              {teacher.firstName} {teacher.lastName}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{teacher.email}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Giáo viên</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
