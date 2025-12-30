'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ArrowLeft, Save, Eye, Loader2, Trash2, Globe, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { value: 'NEWS', label: 'Tin Tức' },
  { value: 'ANNOUNCEMENT', label: 'Thông Báo' },
  { value: 'EVENT_RECAP', label: 'Tổng Kết Sự Kiện' },
  { value: 'STUDENT_SPOTLIGHT', label: 'Học Sinh Tiêu Biểu' },
  { value: 'TEACHER_SPOTLIGHT', label: 'Giáo Viên Tiêu Biểu' },
  { value: 'COMMUNITY', label: 'Cộng Đồng' },
  { value: 'TNTT', label: 'TNTT' },
  { value: 'GENERAL', label: 'Chung' },
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featuredImage: string | null;
  tags: string | null;
  authorName: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'NEWS',
    featuredImage: '',
    tags: '',
    authorName: '',
    isPublished: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Không tìm thấy bài viết');
        }

        setPost(data.data);
        setFormData({
          title: data.data.title,
          slug: data.data.slug,
          excerpt: data.data.excerpt || '',
          content: data.data.content,
          category: data.data.category,
          featuredImage: data.data.featuredImage || '',
          tags: data.data.tags || '',
          authorName: data.data.authorName || '',
          isPublished: data.data.isPublished,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isPublished: publish !== undefined ? publish : formData.isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      router.push('/admin/dashboard/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      toast.success('Đã xóa bài viết thành công');
      router.push('/admin/dashboard/blog');
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <h2 className="font-serif text-xl font-bold text-gray-900">Không tìm thấy bài viết</h2>
          <Link
            href="/admin/dashboard/blog"
            className="mt-4 inline-flex items-center gap-2 text-brand-navy hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/blog"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  formData.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {formData.isPublished ? (
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
              <span className="text-sm text-gray-500">
                {post.viewCount} lượt xem
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Nội dung bài viết</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Đường dẫn (slug) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/blog/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Hỗ trợ HTML cơ bản: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Cài đặt đăng</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">Phân cách bằng dấu phẩy</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Hình ảnh đại diện</h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                />
              </div>

              {formData.featuredImage && (
                <div className="mt-4">
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="w-full rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="space-y-3">
                {formData.isPublished ? (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 font-semibold text-yellow-800 hover:bg-yellow-100 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                    Chuyển về bản nháp
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    Đăng bài
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Lưu thay đổi
                </button>
                {post.isPublished && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Globe className="h-5 w-5" />
                    Xem bài viết
                  </Link>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="mb-4 font-semibold text-red-900">Vùng nguy hiểm</h2>
              <ConfirmDialog
                title="Xóa bài viết?"
                message={`Bạn có chắc muốn xóa "${formData.title}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                trigger={
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                    Xóa bài viết
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
