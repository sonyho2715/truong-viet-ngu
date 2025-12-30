'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
}

const eventTypeLabels: Record<string, string> = {
  CLASS: 'Lớp Học',
  TNTT: 'TNTT',
  HOLIDAY: 'Nghỉ Lễ',
  SPECIAL_EVENT: 'Sự Kiện Đặc Biệt',
  MASS: 'Thánh Lễ',
  MEETING: 'Họp',
};

const eventTypeColors: Record<string, string> = {
  CLASS: 'bg-blue-100 text-blue-800',
  TNTT: 'bg-green-100 text-green-800',
  HOLIDAY: 'bg-red-100 text-red-800',
  SPECIAL_EVENT: 'bg-purple-100 text-purple-800',
  MASS: 'bg-amber-100 text-amber-800',
  MEETING: 'bg-gray-100 text-gray-800',
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, search, filterType]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (filterType) params.append('type', filterType);

      const res = await fetch(`/api/admin/calendar?${params}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/calendar/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Đã xóa sự kiện thành công');
        fetchEvents();
      } else {
        toast.error('Không thể xóa sự kiện');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Có lỗi xảy ra khi xóa sự kiện');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Lịch</h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý sự kiện và lịch học của trường
          </p>
        </div>
        <Link
          href="/admin/dashboard/calendar/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
        >
          <Plus className="h-4 w-4" />
          Thêm Sự Kiện
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        >
          <option value="">Tất cả loại</option>
          {Object.entries(eventTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-600">Chưa có sự kiện nào</p>
            <Link
              href="/admin/dashboard/calendar/new"
              className="mt-4 inline-block text-brand-navy hover:underline"
            >
              Thêm sự kiện mới
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Sự kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.title}
                      </div>
                      {event.location && (
                        <div className="text-sm text-gray-500">
                          {event.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${eventTypeColors[event.eventType]}`}
                    >
                      {eventTypeLabels[event.eventType]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {formatDate(event.startDate)}
                    {event.endDate &&
                      new Date(event.endDate).toDateString() !==
                        new Date(event.startDate).toDateString() && (
                        <> - {formatDate(event.endDate)}</>
                      )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {event.startTime || '-'}
                    {event.endTime && ` - ${event.endTime}`}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        event.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/calendar/${event.id}`}
                        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <ConfirmDialog
                        title="Xóa sự kiện?"
                        message={`Bạn có chắc muốn xóa "${event.title}"? Hành động này không thể hoàn tác.`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        variant="danger"
                        onConfirm={() => handleDelete(event.id)}
                        trigger={
                          <button
                            type="button"
                            className="rounded p-1 text-gray-600 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <div className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
