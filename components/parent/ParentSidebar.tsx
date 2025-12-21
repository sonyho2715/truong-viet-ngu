'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ParentSessionData } from '@/lib/parent-auth';
import { Home, Users, Calendar, BookOpen, FileText, User, Bell } from 'lucide-react';

interface ParentSidebarProps {
  parent: ParentSessionData;
}

const navigation = [
  {
    name: 'Tổng quan',
    href: '/parent/dashboard',
    icon: Home,
  },
  {
    name: 'Học sinh',
    href: '/parent/students',
    icon: Users,
  },
  {
    name: 'Điểm danh',
    href: '/parent/attendance',
    icon: Calendar,
  },
  {
    name: 'Điểm số',
    href: '/parent/grades',
    icon: BookOpen,
  },
  {
    name: 'Phiếu liên lạc',
    href: '/parent/reports',
    icon: FileText,
  },
  {
    name: 'Thông báo',
    href: '/parent/announcements',
    icon: Bell,
  },
  {
    name: 'Hồ sơ',
    href: '/parent/profile',
    icon: User,
  },
];

export function ParentSidebar({ parent }: ParentSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-cream">
            <span className="font-serif text-lg font-bold text-brand-navy">TV</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate font-serif text-base font-bold text-brand-navy">
              Trường Việt Ngữ
            </h1>
            <p className="truncate text-xs text-gray-500">Cổng phụ huynh</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
            <p className="text-xs font-semibold text-gray-700">
              {parent.lastName} {parent.firstName}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{parent.email}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Phụ huynh</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
