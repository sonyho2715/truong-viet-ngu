'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Album {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  eventDate: string | null;
  isActive: boolean;
  displayOrder: number;
  _count: {
    photos: number;
  };
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    eventDate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data.success) {
        setAlbums(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        title: album.title,
        description: album.description || '',
        coverImage: album.coverImage || '',
        eventDate: album.eventDate ? album.eventDate.split('T')[0] : '',
        isActive: album.isActive,
      });
    } else {
      setEditingAlbum(null);
      setFormData({
        title: '',
        description: '',
        coverImage: '',
        eventDate: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingAlbum
      ? `/api/admin/gallery/${editingAlbum.id}`
      : '/api/admin/gallery';
    const method = editingAlbum ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventDate: formData.eventDate || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(editingAlbum ? 'Đã cập nhật album thành công' : 'Đã tạo album thành công');
        fetchAlbums();
        setIsModalOpen(false);
      } else {
        toast.error(data.error || 'Không thể lưu album');
      }
    } catch (error) {
      console.error('Failed to save album:', error);
      toast.error('Có lỗi xảy ra khi lưu album');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Đã xóa album thành công');
        fetchAlbums();
      } else {
        toast.error('Không thể xóa album');
      }
    } catch (error) {
      console.error('Failed to delete album:', error);
      toast.error('Có lỗi xảy ra khi xóa album');
    }
  };

  const toggleActive = async (album: Album) => {
    try {
      const res = await fetch(`/api/admin/gallery/${album.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: album.title,
          description: album.description,
          coverImage: album.coverImage,
          eventDate: album.eventDate,
          isActive: !album.isActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(album.isActive ? 'Đã ẩn album' : 'Đã hiện album');
        fetchAlbums();
      } else {
        toast.error(data.error || 'Không thể thay đổi trạng thái');
      }
    } catch (error) {
      console.error('Failed to toggle album:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('category', 'GALLERY');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, coverImage: data.url });
        toast.success('Đã tải ảnh lên thành công');
      } else {
        toast.error(data.error || 'Không thể tải ảnh lên');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thư Viện Ảnh</h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý album và hình ảnh sự kiện
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
        >
          <Plus className="h-4 w-4" />
          Tạo Album
        </button>
      </div>

      {/* Albums Grid */}
      <div className="rounded-lg bg-white shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent"></div>
          </div>
        ) : albums.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-600">Chưa có album nào</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-brand-navy hover:underline"
            >
              Tạo album mới
            </button>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                {/* Cover Image */}
                <div className="relative aspect-video bg-gray-100">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute right-2 top-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        album.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {album.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{album.title}</h3>
                  {album.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {album.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{album._count.photos} ảnh</span>
                    {album.eventDate && (
                      <span>
                        {new Date(album.eventDate).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-100">
                  <a
                    href={`/admin/dashboard/gallery/${album.id}`}
                    className="flex flex-1 items-center justify-center gap-1 py-2 text-sm text-brand-navy hover:bg-gray-50"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Quản lý ảnh
                  </a>
                  <button
                    onClick={() => toggleActive(album)}
                    className="flex flex-1 items-center justify-center gap-1 border-l border-gray-100 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {album.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Ẩn
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Hiện
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openModal(album)}
                    className="flex flex-1 items-center justify-center gap-1 border-l border-gray-100 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <ConfirmDialog
                    title="Xóa album?"
                    message={`Bạn có chắc muốn xóa "${album.title}"? Tất cả ảnh trong album cũng sẽ bị xóa.`}
                    confirmText="Xóa"
                    cancelText="Hủy"
                    variant="danger"
                    onConfirm={() => handleDelete(album.id)}
                    trigger={
                      <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-1 border-l border-gray-100 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingAlbum ? 'Chỉnh Sửa Album' : 'Tạo Album Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh bìa
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {formData.coverImage && (
                    <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                      <Image
                        src={formData.coverImage}
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
                  Tên album <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="VD: Tết Nguyên Đán 2024"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Mô tả về album này..."
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sự kiện
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
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
                <span className="text-sm text-gray-700">Hiển thị album</span>
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
                  disabled={!formData.title}
                  className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
                >
                  {editingAlbum ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
