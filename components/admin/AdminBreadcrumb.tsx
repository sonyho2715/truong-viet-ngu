'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items?: BreadcrumbItem[];
}

// Vietnamese labels for common routes
const routeLabels: Record<string, string> = {
  dashboard: 'Tổng quan',
  announcements: 'Thông báo',
  classes: 'Lớp học',
  students: 'Học sinh',
  teachers: 'Giáo viên',
  materials: 'Tài liệu',
  settings: 'Cài đặt',
  new: 'Thêm mới',
};

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-brand-navy"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Trang chủ</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.href && index < breadcrumbItems.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 transition-colors hover:text-brand-navy"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-brand-navy">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove /admin/dashboard prefix and split
  const path = pathname.replace('/admin/dashboard', '').replace(/^\//, '');
  if (!path) return [];

  const segments = path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let currentPath = '/admin/dashboard';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Check if this is an ID (cuid format or numeric)
    const isId = /^[a-z0-9]{20,}$/i.test(segment) || /^\d+$/.test(segment);

    if (isId) {
      // For IDs, use "Chi tiết" as label
      items.push({
        label: 'Chi tiết',
        href: i < segments.length - 1 ? currentPath : undefined,
      });
    } else {
      // Use predefined label or capitalize the segment
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      items.push({
        label,
        href: i < segments.length - 1 ? currentPath : undefined,
      });
    }
  }

  return items;
}
