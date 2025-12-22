'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Megaphone,
  Users,
  GraduationCap,
  FileText,
  Mail,
  Heart,
  Newspaper,
  BookOpen,
  FolderOpen,
  Calendar,
  Image,
  Presentation,
  Settings,
  ChevronDown,
} from 'lucide-react';
import type { SessionData } from '@/lib/auth';

interface AdminSidebarProps {
  session: SessionData;
}

const menuGroups = [
  {
    label: null, // No label for main items
    items: [
      { name: 'Tổng quan', href: '/admin/dashboard', icon: Home },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      { name: 'Giáo viên', href: '/admin/dashboard/teachers', icon: Users },
      { name: 'Học sinh', href: '/admin/dashboard/students', icon: GraduationCap },
      { name: 'Lớp học', href: '/admin/dashboard/classes', icon: BookOpen },
      { name: 'Đơn đăng ký', href: '/admin/dashboard/registrations', icon: FileText },
    ],
  },
  {
    label: 'Nội dung',
    items: [
      { name: 'Thông báo', href: '/admin/dashboard/announcements', icon: Megaphone },
      { name: 'Tin tức', href: '/admin/dashboard/blog', icon: Newspaper },
      { name: 'Tài liệu học tập', href: '/admin/dashboard/materials', icon: FolderOpen },
      { name: 'Lịch sự kiện', href: '/admin/dashboard/calendar', icon: Calendar },
    ],
  },
  {
    label: 'Media',
    items: [
      { name: 'Thư viện ảnh', href: '/admin/dashboard/gallery', icon: Image },
      { name: 'Slideshow', href: '/admin/dashboard/slideshow', icon: Presentation },
    ],
  },
  {
    label: 'Liên hệ',
    items: [
      { name: 'Tin nhắn', href: '/admin/dashboard/contacts', icon: Mail },
      { name: 'Tình nguyện viên', href: '/admin/dashboard/volunteers', icon: Heart },
    ],
  },
];

const bottomItems = [
  { name: 'Cài đặt', href: '/admin/dashboard/settings', icon: Settings },
];

export function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-white lg:flex">
        {/* Logo Section */}
        <div className="flex h-14 items-center gap-2 px-4 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <span className="font-bold text-sm text-yellow-400">TV</span>
          </div>
          <span className="font-semibold text-gray-900">Trường Việt Ngữ</span>
        </div>

        {/* Workspace Selector */}
        <div className="px-3 py-3">
          <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span>Admin Panel</span>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={groupIndex > 0 ? 'mt-6' : ''}>
              {group.label && (
                <h3 className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {group.label}
                </h3>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-gray-900' : 'text-gray-400'} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 p-3">
          {/* Settings Link */}
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={active ? 'text-gray-900' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* User Info */}
          <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {session.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop & Menu handled in header */}
    </>
  );
}
