import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Tổng quan | Trang quản trị',
};

export default async function DashboardPage() {
  // Fetch stats
  const [announcementCount, classCount, materialCount, activeAnnouncementsCount] =
    await Promise.all([
      db.announcement.count(),
      db.class.count({ where: { isActive: true } }),
      db.learningMaterial.count({ where: { isActive: true } }),
      db.announcement.count({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
      }),
    ]);

  const stats = [
    {
      name: 'Thông báo hiện tại',
      value: activeAnnouncementsCount,
      total: announcementCount,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      href: '/admin/dashboard/announcements',
      color: 'bg-blue-500',
    },
    {
      name: 'Lớp học đang hoạt động',
      value: classCount,
      total: classCount,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      href: '/admin/dashboard/classes',
      color: 'bg-green-500',
    },
    {
      name: 'Tài liệu học tập',
      value: materialCount,
      total: materialCount,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      href: '/admin/dashboard/materials',
      color: 'bg-purple-500',
    },
  ];

  // Fetch recent announcements
  const recentAnnouncements = await db.announcement.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng đến với trang quản trị Trường Việt Ngữ
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-gold hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 font-serif text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.total !== stat.value && (
                  <p className="mt-1 text-xs text-gray-500">Tổng cộng: {stat.total}</p>
                )}
              </div>
              <div className={`rounded-lg ${stat.color} p-3 text-white`}>{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-brand-gold opacity-0 transition-opacity group-hover:opacity-100">
              Quản lý
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl font-bold text-gray-900">Hành động nhanh</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/dashboard/announcements?action=new"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all hover:border-brand-gold hover:bg-brand-cream"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Thêm thông báo</p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/classes?action=new"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all hover:border-brand-gold hover:bg-brand-cream"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Thêm lớp học</p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/materials?action=new"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all hover:border-brand-gold hover:bg-brand-cream"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Thêm tài liệu</p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/settings"
            className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all hover:border-brand-gold hover:bg-brand-cream"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Cài đặt</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-gray-900">Thông báo gần đây</h2>
          <Link
            href="/admin/dashboard/announcements"
            className="text-sm font-medium text-brand-gold hover:text-brand-gold/80"
          >
            Xem tất cả →
          </Link>
        </div>

        {recentAnnouncements.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có thông báo nào</p>
        ) : (
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/admin/dashboard/announcements/${announcement.id}`}
                className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-gold hover:bg-brand-cream"
              >
                <div
                  className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    announcement.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{announcement.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {announcement.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="rounded bg-gray-100 px-2 py-1">{announcement.category}</span>
                    <span>{new Date(announcement.startDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
