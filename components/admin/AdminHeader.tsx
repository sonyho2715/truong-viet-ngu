'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/actions';
import type { SessionData } from '@/lib/auth';
import {
  Menu,
  X,
  ExternalLink,
  LogOut,
  Bell,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Megaphone,
  Newspaper,
  FolderOpen,
  Calendar,
  Image,
  Presentation,
  Mail,
  Heart,
  Settings,
} from 'lucide-react';

interface AdminHeaderProps {
  session: SessionData;
}

const mobileMenuItems = [
  { name: 'Tổng quan', href: '/admin/dashboard', icon: Home },
  { name: 'Giáo viên', href: '/admin/dashboard/teachers', icon: Users },
  { name: 'Học sinh', href: '/admin/dashboard/students', icon: GraduationCap },
  { name: 'Lớp học', href: '/admin/dashboard/classes', icon: BookOpen },
  { name: 'Đơn đăng ký', href: '/admin/dashboard/registrations', icon: FileText },
  { name: 'Thông báo', href: '/admin/dashboard/announcements', icon: Megaphone },
  { name: 'Tin tức', href: '/admin/dashboard/blog', icon: Newspaper },
  { name: 'Tài liệu', href: '/admin/dashboard/materials', icon: FolderOpen },
  { name: 'Lịch sự kiện', href: '/admin/dashboard/calendar', icon: Calendar },
  { name: 'Thư viện ảnh', href: '/admin/dashboard/gallery', icon: Image },
  { name: 'Slideshow', href: '/admin/dashboard/slideshow', icon: Presentation },
  { name: 'Tin nhắn', href: '/admin/dashboard/contacts', icon: Mail },
  { name: 'Tình nguyện viên', href: '/admin/dashboard/volunteers', icon: Heart },
  { name: 'Cài đặt', href: '/admin/dashboard/settings', icon: Settings },
];

// Map pathname to page title
const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Tổng quan',
  '/admin/dashboard/teachers': 'Giáo viên',
  '/admin/dashboard/students': 'Học sinh',
  '/admin/dashboard/classes': 'Lớp học',
  '/admin/dashboard/registrations': 'Đơn đăng ký',
  '/admin/dashboard/announcements': 'Thông báo',
  '/admin/dashboard/blog': 'Tin tức',
  '/admin/dashboard/materials': 'Tài liệu học tập',
  '/admin/dashboard/calendar': 'Lịch sự kiện',
  '/admin/dashboard/gallery': 'Thư viện ảnh',
  '/admin/dashboard/slideshow': 'Slideshow',
  '/admin/dashboard/contacts': 'Tin nhắn liên hệ',
  '/admin/dashboard/volunteers': 'Tình nguyện viên',
  '/admin/dashboard/settings': 'Cài đặt',
};

export function AdminHeader({ session }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get current page title
  const getPageTitle = () => {
    // Check exact match first
    if (pageTitles[pathname]) return pageTitles[pathname];

    // Check for nested routes (e.g., /admin/dashboard/teachers/new)
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path) && path !== '/admin/dashboard') {
        return title;
      }
    }
    return 'Dashboard';
  };

  async function handleLogout() {
    await logoutAction();
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Left Side - Mobile Menu Button & Page Title */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* View Site Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Xem website</span>
            </Link>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-white text-xs font-bold">
                  {session.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <form action={handleLogout}>
              <button
                type="submit"
                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            {/* Header */}
            <div className="flex h-14 items-center justify-between px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                  <span className="font-bold text-sm text-yellow-400">TV</span>
                </div>
                <span className="font-semibold text-gray-900">Trường Việt Ngữ</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <div className="space-y-0.5">
                {mobileMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {session.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
