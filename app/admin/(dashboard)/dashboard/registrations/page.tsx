import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { RegistrationStatus } from '@prisma/client';
import { Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';

export const metadata = {
  title: 'Đơn đăng ký | Trang quản trị',
};

const ITEMS_PER_PAGE = 10;

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

const statusConfig: Record<RegistrationStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  UNDER_REVIEW: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  WAITLISTED: { label: 'Danh sách chờ', color: 'bg-purple-100 text-purple-800', icon: Users },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function RegistrationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';
  const statusFilter = params.status || '';

  // Build where clause
  const whereClause: Record<string, unknown> = {};

  if (search) {
    whereClause.OR = [
      { studentFirstName: { contains: search, mode: 'insensitive' } },
      { studentLastName: { contains: search, mode: 'insensitive' } },
      { parentFirstName: { contains: search, mode: 'insensitive' } },
      { parentLastName: { contains: search, mode: 'insensitive' } },
      { parentEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (statusFilter && statusFilter in RegistrationStatus) {
    whereClause.status = statusFilter;
  }

  // Get counts by status
  const [totalCount, pendingCount, underReviewCount, approvedCount, applications] = await Promise.all([
    db.registrationApplication.count({ where: whereClause }),
    db.registrationApplication.count({ where: { status: 'PENDING' } }),
    db.registrationApplication.count({ where: { status: 'UNDER_REVIEW' } }),
    db.registrationApplication.count({ where: { status: 'APPROVED' } }),
    db.registrationApplication.findMany({
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }],
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Đơn đăng ký học sinh</h1>
          <p className="mt-2 text-gray-600">
            Xem xét và duyệt đơn đăng ký học sinh mới
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
              <p className="text-sm text-yellow-700">Chờ xử lý</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{underReviewCount}</p>
              <p className="text-sm text-blue-700">Đang xem xét</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
              <p className="text-sm text-green-700">Đã duyệt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 sm:max-w-md">
          <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
            <SearchInput placeholder="Tìm kiếm theo tên hoặc email..." />
          </Suspense>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/registrations"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !statusFilter ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </Link>
          <Link
            href="/admin/dashboard/registrations?status=PENDING"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chờ xử lý
          </Link>
          <Link
            href="/admin/dashboard/registrations?status=UNDER_REVIEW"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'UNDER_REVIEW' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đang xem xét
          </Link>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có đơn đăng ký nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy đơn nào với từ khóa "${search}"`
              : 'Đơn đăng ký mới sẽ xuất hiện ở đây.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phụ huynh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Lớp đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ngày gửi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {app.studentFirstName} {app.studentLastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Sinh: {new Date(app.studentDOB).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="text-gray-900">
                          {app.parentFirstName} {app.parentLastName}
                        </p>
                        <p className="text-sm text-gray-500">{app.parentEmail}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-gray-900">
                        {app.preferredGrade ? gradeLevelLabels[app.preferredGrade] : 'Chưa chọn'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/admin/dashboard/registrations/${app.id}`}
                        className="font-medium text-brand-navy hover:text-brand-gold"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
