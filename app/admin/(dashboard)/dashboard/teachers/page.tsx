import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Quản lý giáo viên | Trang quản trị',
};

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function TeachersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';

  // Build where clause for search
  const whereClause = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get total count and teachers with pagination
  const [totalCount, teachers] = await Promise.all([
    db.teacher.count({ where: whereClause }),
    db.teacher.findMany({
      where: whereClause,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }, { firstName: 'asc' }],
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý giáo viên</h1>
          <p className="mt-2 text-gray-600">
            Danh sách {totalCount} giáo viên
          </p>
        </div>
        <Link
          href="/admin/dashboard/teachers/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm giáo viên
        </Link>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchInput placeholder="Tìm kiếm giáo viên..." />
        </Suspense>
      </div>

      {/* Teachers Grid */}
      {teachers.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có giáo viên nào'}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {search
              ? `Không tìm thấy giáo viên nào với từ khóa "${search}"`
              : 'Bắt đầu bằng cách thêm giáo viên đầu tiên'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/teachers/new"
              className="mt-4 inline-block rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy"
            >
              Thêm giáo viên
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <Link
              key={teacher.id}
              href={`/admin/dashboard/teachers/${teacher.id}`}
              className="group rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-lg"
            >
              {/* Teacher Info */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy text-white">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {teacher.firstName[0]}
                      {teacher.lastName[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-brand-navy">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{teacher.email}</p>
                  {teacher.phone && (
                    <p className="text-sm text-gray-600">{teacher.phone}</p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <Badge variant={teacher.isActive ? 'success' : 'default'} dot>
                  {teacher.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>

              {/* Classes Count */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>
                    {teacher.classes.length} lớp đang dạy
                  </span>
                </div>
                {teacher.classes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {teacher.classes.map((cls) => (
                      <Badge key={cls.id} variant="info" size="sm">
                        {cls.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Bio Preview */}
              {teacher.bio && (
                <p className="mt-4 line-clamp-2 text-sm text-gray-600">{teacher.bio}</p>
              )}
            </Link>
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
