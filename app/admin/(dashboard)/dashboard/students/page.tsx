import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { ExportButton } from '@/components/ui/ExportButton';

export const metadata = {
  title: 'Quản lý học sinh | Trang quản trị',
};

const ITEMS_PER_PAGE = 12;

const gradeLevelLabels: Record<string, string> = {
  MAU_GIAO_A: 'Mẫu Giáo A',
  MAU_GIAO_B: 'Mẫu Giáo B',
  MAU_GIAO_C: 'Mẫu Giáo C',
  LOP_1: 'Lớp 1',
  LOP_2: 'Lớp 2',
  LOP_3: 'Lớp 3',
  LOP_4: 'Lớp 4',
  LOP_5: 'Lớp 5',
  LOP_6: 'Lớp 6',
  LOP_7: 'Lớp 7',
  AU_NHI: 'Ấu Nhi',
  THIEU_NHI: 'Thiếu Nhi',
  NGHIA_SI: 'Nghĩa Sĩ',
  HIEP_SI: 'Hiệp Sĩ',
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';

  // Build where clause for search
  const whereClause = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { parentName: { contains: search, mode: 'insensitive' as const } },
          { parentEmail: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get total count and students with pagination
  const [totalCount, students] = await Promise.all([
    db.student.count({ where: whereClause }),
    db.student.findMany({
      where: whereClause,
      include: {
        enrollments: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
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
      <AdminBreadcrumb />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="mt-2 text-gray-600">
            Quản lý thông tin học sinh và ghi danh vào các lớp học
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton type="students" label="Xuất danh sách" />
          <Link
            href="/admin/dashboard/students/new"
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
            Thêm học sinh
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchInput placeholder="Tìm kiếm học sinh..." />
        </Suspense>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có học sinh nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy học sinh nào với từ khóa "${search}"`
              : 'Bắt đầu bằng cách thêm học sinh đầu tiên.'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/students/new"
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
              Thêm học sinh
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/admin/dashboard/students/${student.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-gold hover:shadow-lg"
            >
              {/* Student Photo */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy/80">
                {student.photoUrl ? (
                  <Image
                    src={student.photoUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      className="h-24 w-24 text-brand-gold opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                {/* Active Status Badge */}
                <div className="absolute right-2 top-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      student.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    {student.isActive ? 'Đang học' : 'Tạm nghỉ'}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="p-4">
                <h3 className="mb-2 font-serif text-xl font-bold text-brand-navy">
                  {student.firstName} {student.lastName}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {student.gradeLevel && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>{gradeLevelLabels[student.gradeLevel]}</span>
                    </div>
                  )}
                  {student.enrollments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>
                        {student.enrollments.length}{' '}
                        {student.enrollments.length === 1 ? 'lớp' : 'lớp'}
                      </span>
                    </div>
                  )}
                  {student.parentName && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="truncate">{student.parentName}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-brand-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Xem chi tiết
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
              </div>
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
