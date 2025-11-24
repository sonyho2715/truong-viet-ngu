import Link from 'next/link';
import type { Announcement } from '@prisma/client';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

const categoryLabels: Record<string, string> = {
  CHOIR: 'Ca đoàn TNTT',
  BIBLE: 'Đọc Sách Thánh',
  EVENT: 'Sự kiện',
  GENERAL: 'Thông báo chung',
  HOLIDAY: 'Nghỉ lễ',
};

const categoryColors: Record<string, string> = {
  CHOIR: 'bg-purple-100 text-purple-800',
  BIBLE: 'bg-blue-100 text-blue-800',
  EVENT: 'bg-green-100 text-green-800',
  GENERAL: 'bg-gray-100 text-gray-800',
  HOLIDAY: 'bg-red-100 text-red-800',
};

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const activeAnnouncements = announcements
    .filter((a) => a.isActive)
    .filter((a) => {
      const now = new Date();
      const start = new Date(a.startDate);
      const end = a.endDate ? new Date(a.endDate) : null;
      return start <= now && (!end || end >= now);
    })
    .sort((a, b) => b.priority - a.priority);

  if (activeAnnouncements.length === 0) {
    return null;
  }

  return (
    <section id="announcements" className="bg-gray-50 px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
            Thông Báo
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Cập nhật tin tức mới nhất từ trường
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeAnnouncements.map((announcement) => (
            <article
              key={announcement.id}
              className="group rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-lg"
            >
              {/* Category & Priority Badges */}
              <div className="mb-4 flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    categoryColors[announcement.category]
                  }`}
                >
                  {categoryLabels[announcement.category]}
                </span>
                {announcement.priority > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-orange-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    Quan trọng
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="mb-3 font-serif text-xl font-bold text-gray-900 group-hover:text-brand-navy">
                {announcement.title}
              </h3>

              {/* Description */}
              <p className="mb-4 line-clamp-3 text-gray-600">
                {announcement.description}
              </p>

              {/* Date Range */}
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={announcement.startDate.toISOString()}>
                  {new Date(announcement.startDate).toLocaleDateString('vi-VN')}
                </time>
                {announcement.endDate && (
                  <>
                    <span>-</span>
                    <time dateTime={announcement.endDate.toISOString()}>
                      {new Date(announcement.endDate).toLocaleDateString('vi-VN')}
                    </time>
                  </>
                )}
              </div>

              {/* Read More (Optional - can link to detail page) */}
              <div className="flex items-center gap-2 text-sm font-medium text-brand-gold opacity-0 transition-opacity group-hover:opacity-100">
                Xem chi tiết
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
