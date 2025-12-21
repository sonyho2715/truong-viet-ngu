import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Newspaper, Plus, Eye, Calendar, Edit, Globe, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Quản lý tin tức | Trang quản trị',
};

const ITEMS_PER_PAGE = 10;

const categoryLabels: Record<string, string> = {
  NEWS: 'Tin Tức',
  ANNOUNCEMENT: 'Thông Báo',
  EVENT_RECAP: 'Tổng Kết Sự Kiện',
  STUDENT_SPOTLIGHT: 'Học Sinh Tiêu Biểu',
  TEACHER_SPOTLIGHT: 'Giáo Viên Tiêu Biểu',
  COMMUNITY: 'Cộng Đồng',
  TNTT: 'TNTT',
  GENERAL: 'Chung',
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function BlogAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';
  const statusFilter = params.status || '';

  // Build where clause
  const whereClause: Record<string, unknown> = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (statusFilter === 'published') {
    whereClause.isPublished = true;
  } else if (statusFilter === 'draft') {
    whereClause.isPublished = false;
  }

  // Get counts and posts
  const [totalCount, publishedCount, draftCount, posts] = await Promise.all([
    db.blogPost.count({ where: whereClause }),
    db.blogPost.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { isPublished: false } }),
    db.blogPost.findMany({
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="mt-2 text-gray-600">
            Quản lý các bài viết tin tức và thông báo
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90"
        >
          <Plus className="h-5 w-5" />
          Thêm bài viết
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Newspaper className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
              <p className="text-sm text-blue-700">Tổng số bài viết</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{publishedCount}</p>
              <p className="text-sm text-green-700">Đã đăng</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <EyeOff className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{draftCount}</p>
              <p className="text-sm text-yellow-700">Bản nháp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 sm:max-w-md">
          <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-200" />}>
            <SearchInput placeholder="Tìm kiếm bài viết..." />
          </Suspense>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/blog"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !statusFilter ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </Link>
          <Link
            href="/admin/dashboard/blog?status=published"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'published' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã đăng
          </Link>
          <Link
            href="/admin/dashboard/blog?status=draft"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'draft' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bản nháp
          </Link>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có bài viết nào'}
          </h3>
          <p className="mt-2 text-gray-600">
            {search
              ? `Không tìm thấy bài viết nào với từ khóa "${search}"`
              : 'Tạo bài viết đầu tiên để bắt đầu.'}
          </p>
          {!search && (
            <Link
              href="/admin/dashboard/blog/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90"
            >
              <Plus className="h-5 w-5" />
              Thêm bài viết
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">/blog/{post.slug}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {categoryLabels[post.category]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.isPublished ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Đã đăng
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Bản nháp
                        </>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      {post.viewCount}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {post.isPublished && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Xem bài viết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/dashboard/blog/${post.id}`}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-navy"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
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
