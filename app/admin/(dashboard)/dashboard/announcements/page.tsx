import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { DeleteAnnouncementButton } from '@/components/admin/DeleteAnnouncementButton';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { AnnouncementListSkeleton } from '@/components/ui/Skeleton';

export const metadata = {
  title: 'Quản lý thông báo | Trang quản trị',
};

const ITEMS_PER_PAGE = 10;

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

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';

  // Build where clause for search
  const whereClause = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get total count and announcements with pagination
  const [totalCount, announcements] = await Promise.all([
    db.announcement.count({ where: whereClause }),
    db.announcement.findMany({
      where: whereClause,
      orderBy: [{ isActive: 'desc' }, { priority: 'desc' }, { startDate: 'desc' }],
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý thông báo</h1>
          <p className="mt-2 text-gray-600">
            Tạo và quản lý thông báo cho học sinh và phụ huynh
          </p>
        </div>
        <Link
          href="/admin/dashboard/announcements/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm thông báo
        </Link>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchInput placeholder="Tìm kiếm thông báo..." />
        </Suspense>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có thông báo nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy thông báo nào với từ khóa "${search}"`
              : 'Bắt đầu bằng cách tạo thông báo đầu tiên.'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/announcements/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy transition-all hover:bg-brand-gold/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo thông báo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-gold hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Status Indicator */}
                <div
                  className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${
                    announcement.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  title={announcement.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold text-gray-900">
                        {announcement.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-gray-600">
                        {announcement.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/announcements/${announcement.id}`}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:border-brand-gold hover:text-brand-gold"
                        title="Chỉnh sửa"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <DeleteAnnouncementButton
                        id={announcement.id}
                        title={announcement.title}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
                        categoryColors[announcement.category]
                      }`}
                    >
                      {categoryLabels[announcement.category]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(announcement.startDate).toLocaleDateString('vi-VN')}
                      {announcement.endDate &&
                        ` - ${new Date(announcement.endDate).toLocaleDateString('vi-VN')}`}
                    </span>
                    {announcement.priority > 0 && (
                      <span className="inline-flex items-center gap-1 text-orange-600">
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
                        Ưu tiên: {announcement.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
