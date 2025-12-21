import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { ContactStatus } from '@prisma/client';
import { Mail, MailOpen, Reply, Archive, Clock } from 'lucide-react';

export const metadata = {
  title: 'Tin nhắn liên hệ | Trang quản trị',
};

const ITEMS_PER_PAGE = 15;

const statusConfig: Record<ContactStatus, { label: string; color: string; icon: React.ElementType }> = {
  NEW: { label: 'Mới', color: 'bg-blue-100 text-blue-800', icon: Mail },
  READ: { label: 'Đã đọc', color: 'bg-gray-100 text-gray-800', icon: MailOpen },
  REPLIED: { label: 'Đã trả lời', color: 'bg-green-100 text-green-800', icon: Reply },
  ARCHIVED: { label: 'Lưu trữ', color: 'bg-yellow-100 text-yellow-800', icon: Archive },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';
  const statusFilter = params.status || '';

  // Build where clause
  const whereClause: Record<string, unknown> = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (statusFilter && statusFilter in ContactStatus) {
    whereClause.status = statusFilter;
  }

  // Get counts
  const [totalCount, newCount, messages] = await Promise.all([
    db.contactMessage.count({ where: whereClause }),
    db.contactMessage.count({ where: { status: 'NEW' } }),
    db.contactMessage.findMany({
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Tin nhắn liên hệ</h1>
          <p className="mt-2 text-gray-600">
            Quản lý các tin nhắn từ trang liên hệ
          </p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-800">
            <Mail className="h-5 w-5" />
            <span className="font-medium">{newCount} tin nhắn mới</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 sm:max-w-md">
          <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
            <SearchInput placeholder="Tìm kiếm theo tên, email, chủ đề..." />
          </Suspense>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/dashboard/contacts"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !statusFilter ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </Link>
          <Link
            href="/admin/dashboard/contacts?status=NEW"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'NEW' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mới
          </Link>
          <Link
            href="/admin/dashboard/contacts?status=READ"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'READ' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã đọc
          </Link>
          <Link
            href="/admin/dashboard/contacts?status=REPLIED"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'REPLIED' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã trả lời
          </Link>
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có tin nhắn nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy tin nhắn nào với từ khóa "${search}"`
              : 'Tin nhắn từ trang liên hệ sẽ xuất hiện ở đây.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const status = statusConfig[msg.status];
            const StatusIcon = status.icon;
            return (
              <Link
                key={msg.id}
                href={`/admin/dashboard/contacts/${msg.id}`}
                className={`block rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-brand-gold hover:shadow-md ${
                  msg.status === 'NEW' ? 'border-l-4 border-l-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className={`font-medium ${msg.status === 'NEW' ? 'text-brand-navy' : 'text-gray-900'}`}>
                        {msg.name}
                      </p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{msg.email}</p>
                    <p className="mt-2 font-medium text-gray-800">{msg.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </Link>
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
