import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ArrowRight, Newspaper } from 'lucide-react';

export const metadata = {
  title: 'Tin Tức - Trường Việt Ngữ',
  description: 'Tin tức và hoạt động mới nhất của Trường Việt Ngữ.',
};

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

const categoryColors: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-800',
  ANNOUNCEMENT: 'bg-red-100 text-red-800',
  EVENT_RECAP: 'bg-purple-100 text-purple-800',
  STUDENT_SPOTLIGHT: 'bg-yellow-100 text-yellow-800',
  TEACHER_SPOTLIGHT: 'bg-green-100 text-green-800',
  COMMUNITY: 'bg-pink-100 text-pink-800',
  TNTT: 'bg-teal-100 text-teal-800',
  GENERAL: 'bg-gray-100 text-gray-800',
};

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const categoryFilter = params.category || '';

  // Build where clause
  const whereClause: Record<string, unknown> = {
    isPublished: true,
  };

  if (categoryFilter) {
    whereClause.category = categoryFilter;
  }

  // Get posts
  const [totalCount, posts, categories] = await Promise.all([
    db.blogPost.count({ where: whereClause }),
    db.blogPost.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.blogPost.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { category: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: 'Tin Tức' }]} />
            <div className="text-center">
              <Newspaper className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
              <h1 className="font-serif text-4xl font-bold text-white lg:text-5xl">
                Tin Tức & Hoạt Động
              </h1>
              <p className="mt-4 text-lg text-brand-cream lg:text-xl">
                Cập nhật những tin tức mới nhất từ Trường Việt Ngữ
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Lọc theo:</span>
              <Link
                href="/blog"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !categoryFilter
                    ? 'bg-brand-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/blog?category=${cat.category}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    categoryFilter === cat.category
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoryLabels[cat.category]} ({cat._count.category})
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            {posts.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                    >
                      {/* Featured Image */}
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy/80">
                            <Newspaper className="h-12 w-12 text-brand-gold/50" />
                          </div>
                        )}
                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category]}`}
                          >
                            {categoryLabels[post.category]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.publishedAt?.toISOString()}>
                            {post.publishedAt?.toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>

                        <h2 className="font-serif text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-brand-navy">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="mt-2 text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="mt-4 inline-flex items-center gap-1 font-medium text-brand-navy hover:text-brand-gold"
                        >
                          Đọc thêm
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/blog?page=${currentPage - 1}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Trang trước
                      </Link>
                    )}

                    <span className="px-4 py-2 text-sm text-gray-600">
                      Trang {currentPage} / {totalPages}
                    </span>

                    {currentPage < totalPages && (
                      <Link
                        href={`/blog?page=${currentPage + 1}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Trang sau
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Newspaper className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-600">
                  Chưa có bài viết nào
                </h3>
                <p className="mt-2 text-gray-500">
                  {categoryFilter
                    ? `Chưa có bài viết nào trong danh mục "${categoryLabels[categoryFilter]}".`
                    : 'Các bài viết mới sẽ được cập nhật sớm.'}
                </p>
                {categoryFilter && (
                  <Link
                    href="/blog"
                    className="mt-4 inline-block text-brand-navy hover:underline"
                  >
                    ← Xem tất cả bài viết
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
