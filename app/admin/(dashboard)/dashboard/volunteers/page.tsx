import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Heart, Calendar, MapPin, Users, Plus, Eye } from 'lucide-react';

export const metadata = {
  title: 'Tình nguyện viên | Trang quản trị',
};

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function VolunteersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';

  // Build where clause
  const whereClause: Record<string, unknown> = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get counts and opportunities
  const [totalCount, activeCount, opportunities] = await Promise.all([
    db.volunteerOpportunity.count({ where: whereClause }),
    db.volunteerOpportunity.count({ where: { isActive: true } }),
    db.volunteerOpportunity.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { signups: true },
        },
        signups: {
          where: { status: 'CONFIRMED' },
          select: { id: true },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Tình nguyện viên</h1>
          <p className="mt-2 text-gray-600">
            Quản lý cơ hội tình nguyện và xem danh sách đăng ký
          </p>
        </div>
        <Link
          href="/admin/dashboard/volunteers/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90"
        >
          <Plus className="h-5 w-5" />
          Thêm cơ hội mới
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{activeCount}</p>
              <p className="text-sm text-green-700">Cơ hội đang mở</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              <p className="text-sm text-blue-700">Tổng số cơ hội</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchInput placeholder="Tìm kiếm cơ hội tình nguyện..." />
        </Suspense>
      </div>

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có cơ hội tình nguyện nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy cơ hội nào với từ khóa "${search}"`
              : 'Tạo cơ hội tình nguyện đầu tiên để bắt đầu.'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/volunteers/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90"
            >
              <Plus className="h-5 w-5" />
              Thêm cơ hội mới
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opportunity) => {
            const confirmedCount = opportunity.signups.length;
            return (
              <div
                key={opportunity.id}
                className={`rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  opportunity.isActive ? 'border-green-200' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-bold text-gray-900">
                        {opportunity.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          opportunity.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {opportunity.isActive ? 'Đang mở' : 'Đã đóng'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      {opportunity.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-brand-gold" />
                          <span>
                            {new Date(opportunity.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                      {opportunity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-brand-gold" />
                          <span>{opportunity.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-brand-gold" />
                        <span>
                          {confirmedCount} đăng ký
                          {opportunity.spotsAvailable && ` / ${opportunity.spotsAvailable} chỗ`}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-2 text-gray-600">
                      {opportunity.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/dashboard/volunteers/${opportunity.id}/signups`}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      Xem đăng ký
                    </Link>
                    <Link
                      href={`/admin/dashboard/volunteers/${opportunity.id}`}
                      className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
                    >
                      Chỉnh sửa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
