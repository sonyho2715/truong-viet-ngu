'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Image as ImageIcon, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Slide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  linkText: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminSlideshowPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    linkUrl: '',
    linkText: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slideshow');
      const data = await res.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (slide?: Slide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        imageUrl: slide.imageUrl,
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        linkUrl: slide.linkUrl || '',
        linkText: slide.linkText || '',
        isActive: slide.isActive,
      });
    } else {
      setEditingSlide(null);
      setFormData({
        imageUrl: '',
        title: '',
        subtitle: '',
        linkUrl: '',
        linkText: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingSlide
      ? `/api/admin/slideshow/${editingSlide.id}`
      : '/api/admin/slideshow';
    const method = editingSlide ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchSlides();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save slide:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/slideshow/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Đã xóa slide thành công');
        fetchSlides();
      } else {
        toast.error('Không thể xóa slide');
      }
    } catch (error) {
      console.error('Failed to delete slide:', error);
      toast.error('Có lỗi xảy ra khi xóa slide');
    }
  };

  const toggleActive = async (slide: Slide) => {
    try {
      await fetch(`/api/admin/slideshow/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
      });
      fetchSlides();
    } catch (error) {
      console.error('Failed to toggle slide:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('category', 'SLIDESHOW');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slideshow Trang Chủ</h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý hình ảnh slideshow trên trang chủ
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
        >
          <Plus className="h-4 w-4" />
          Thêm Slide
        </button>
      </div>

      {/* Slides List */}
      <div className="rounded-lg bg-white shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent"></div>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-600">Chưa có slide nào</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-brand-navy hover:underline"
            >
              Thêm slide mới
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50"
              >
                <GripVertical className="h-5 w-5 cursor-move text-gray-400" />

                {/* Thumbnail */}
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {slide.imageUrl && (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title || 'Slide'}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {slide.title || 'Không có tiêu đề'}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-500">{slide.subtitle}</p>
                  )}
                  {slide.linkUrl && (
                    <p className="text-xs text-brand-navy">
                      Link: {slide.linkText || slide.linkUrl}
                    </p>
                  )}
                </div>

                {/* Status */}
                <button
                  onClick={() => toggleActive(slide)}
                  className={`rounded-full p-2 ${
                    slide.isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={slide.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                >
                  {slide.isActive ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(slide)}
                    className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <ConfirmDialog
                    title="Xóa slide?"
                    message={`Bạn có chắc muốn xóa slide "${slide.title || 'này'}"? Hành động này không thể hoàn tác.`}
                    confirmText="Xóa"
                    cancelText="Hủy"
                    variant="danger"
                    onConfirm={() => handleDelete(slide.id)}
                    trigger={
                      <button
                        type="button"
                        className="rounded p-2 text-gray-600 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingSlide ? 'Chỉnh Sửa Slide' : 'Thêm Slide Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {formData.imageUrl && (
                    <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-brand-navy">
                    Tải ảnh lên
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Tiêu đề hiển thị trên slide"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phụ đề
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Mô tả ngắn"
                />
              </div>

              {/* Link */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="/about"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nút bấm
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) =>
                      setFormData({ ...formData, linkText: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Tìm hiểu thêm"
                  />
                </div>
              </div>

              {/* Active */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Hiển thị slide</span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formData.imageUrl}
                  className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
                >
                  {editingSlide ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
