import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';

export const metadata = {
  title: 'Quản lý tài liệu | Trang quản trị',
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

export default async function MaterialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';

  // Build where clause for search
  const whereClause = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { lessonNumbers: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get total count and materials with pagination
  const [totalCount, materials] = await Promise.all([
    db.learningMaterial.count({ where: whereClause }),
    db.learningMaterial.findMany({
      where: whereClause,
      orderBy: [{ gradeLevel: 'asc' }, { displayOrder: 'asc' }],
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý tài liệu học tập</h1>
          <p className="mt-2 text-gray-600">
            Tạo và quản lý tài liệu học tập cho các lớp
          </p>
        </div>
        <Link
          href="/admin/dashboard/materials/new"
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
          Thêm tài liệu
        </Link>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchInput placeholder="Tìm kiếm tài liệu..." />
        </Suspense>
      </div>

      {/* Materials List */}
      {materials.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có tài liệu nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy tài liệu nào với từ khóa "${search}"`
              : 'Bắt đầu bằng cách tạo tài liệu đầu tiên.'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/materials/new"
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
              Tạo tài liệu
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Link
              key={material.id}
              href={`/admin/dashboard/materials/${material.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-gold hover:shadow-lg"
            >
              {/* Material Header */}
              <div className="border-b border-gray-200 bg-gradient-to-br from-brand-navy to-brand-navy/80 p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-navy">
                      {gradeLevelLabels[material.gradeLevel]}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      material.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    {material.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-white">
                  {material.title}
                </h3>
              </div>

              {/* Material Info */}
              <div className="p-4">
                <div className="space-y-2 text-sm text-gray-600">
                  {material.lessonNumbers && (
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium">Bài: {material.lessonNumbers}</span>
                    </div>
                  )}
                  {material.externalLink && (
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span className="truncate">Link ngoài</span>
                    </div>
                  )}
                  {material.fileUrl && (
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
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">File đính kèm</span>
                    </div>
                  )}
                  {material.description && (
                    <p className="mt-2 line-clamp-2 text-gray-500">
                      {material.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-brand-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Chỉnh sửa
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
