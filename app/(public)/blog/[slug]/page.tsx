import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { db } from '@/lib/db';
import { sanitizeHtml } from '@/lib/sanitize';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ArrowLeft, User, Eye, Share2 } from 'lucide-react';

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
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, isPublished: true },
  });

  if (!post) {
    return { title: 'Không tìm thấy bài viết' };
  }

  return {
    title: `${post.title} - Trường Việt Ngữ`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug, isPublished: true },
  });

  if (!post) {
    notFound();
  }

  // Increment view count
  await db.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  // Get related posts
  const relatedPosts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category,
      id: { not: post.id },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <Breadcrumb
              items={[
                { label: 'Tin Tức', href: '/blog' },
                { label: post.title },
              ]}
            />

            <div className="mt-6">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${categoryColors[post.category]}`}
              >
                {categoryLabels[post.category]}
              </span>

              <h1 className="mt-4 font-serif text-3xl font-bold text-white lg:text-4xl">
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-brand-cream">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <time dateTime={post.publishedAt?.toISOString()}>
                    {post.publishedAt?.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {post.authorName && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{post.authorName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span>{post.viewCount + 1} lượt xem</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative aspect-video">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              <article className="p-6 lg:p-10">
                {post.excerpt && (
                  <p className="mb-6 text-lg font-medium text-gray-700 leading-relaxed border-l-4 border-brand-gold pl-4">
                    {post.excerpt}
                  </p>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-navy prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                />

                {/* Tags */}
                {post.tags && (
                  <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
                    <Tag className="h-5 w-5 text-gray-400" />
                    {post.tags.split(',').map((tag) => (
                      <span
                        key={tag.trim()}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Share2 className="h-5 w-5" />
                    Chia sẻ:
                  </span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Facebook
                  </a>
                </div>
              </article>
            </div>

            {/* Back Link */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold"
              >
                <ArrowLeft className="h-5 w-5" />
                Quay lại danh sách tin tức
              </Link>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-white px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-8 font-serif text-2xl font-bold text-brand-navy">
                Bài Viết Liên Quan
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy/80">
                          <Tag className="h-8 w-8 text-brand-gold/50" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500">
                        {related.publishedAt?.toLocaleDateString('vi-VN')}
                      </p>
                      <h3 className="mt-1 font-serif text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-navy">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
