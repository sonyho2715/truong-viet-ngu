import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ContactStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {
  Mail,
  MailOpen,
  Reply,
  Archive,
  ArrowLeft,
  User,
  Phone,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: 'Chi tiết tin nhắn | Trang quản trị',
};

const statusConfig: Record<ContactStatus, { label: string; color: string; bgColor: string; Icon: React.ElementType }> = {
  NEW: { label: 'Mới', color: 'text-blue-800', bgColor: 'bg-blue-100', Icon: Mail },
  READ: { label: 'Đã đọc', color: 'text-gray-800', bgColor: 'bg-gray-100', Icon: MailOpen },
  REPLIED: { label: 'Đã trả lời', color: 'text-green-800', bgColor: 'bg-green-100', Icon: Reply },
  ARCHIVED: { label: 'Lưu trữ', color: 'text-yellow-800', bgColor: 'bg-yellow-100', Icon: Archive },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function updateStatus(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;
  const status = formData.get('status') as ContactStatus;
  const replyNote = formData.get('replyNote') as string;

  const updateData: Record<string, unknown> = { status };

  if (status === 'REPLIED') {
    updateData.repliedAt = new Date();
    updateData.repliedBy = 'Admin';
    updateData.replyNote = replyNote || null;
  }

  await db.contactMessage.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/dashboard/contacts');
  revalidatePath(`/admin/dashboard/contacts/${id}`);
}

async function markAsRead(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;

  await db.contactMessage.update({
    where: { id },
    data: { status: 'READ' },
  });

  revalidatePath('/admin/dashboard/contacts');
  revalidatePath(`/admin/dashboard/contacts/${id}`);
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params;

  let message = await db.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    notFound();
  }

  // Mark as read if new
  if (message.status === 'NEW') {
    message = await db.contactMessage.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  const status = statusConfig[message.status];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Back Link */}
      <Link
        href="/admin/dashboard/contacts"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">{message.subject}</h1>
          <p className="mt-2 text-gray-600">
            Nhận ngày {new Date(message.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium ${status.bgColor} ${status.color}`}>
          <status.Icon className="h-5 w-5" />
          {status.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Sender Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5 text-brand-gold" />
              Thông tin người gửi
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium text-gray-900">{message.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-1 font-medium text-brand-navy hover:underline"
                >
                  {message.email}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {message.phone && (
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <a
                    href={`tel:${message.phone}`}
                    className="flex items-center gap-2 font-medium text-brand-navy hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {message.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Mail className="h-5 w-5 text-brand-gold" />
              Nội dung tin nhắn
            </h2>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-500">Chủ đề: {message.subject}</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-gray-800">{message.message}</p>
              </div>
            </div>
          </div>

          {/* Reply Note (if replied) */}
          {message.replyNote && (
            <div className="rounded-xl bg-green-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-green-900">
                <Reply className="h-5 w-5" />
                Ghi chú phản hồi
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-green-800">{message.replyNote}</p>
              {message.repliedAt && (
                <p className="mt-4 text-sm text-green-700">
                  Đã phản hồi ngày {new Date(message.repliedAt).toLocaleString('vi-VN')}
                  {message.repliedBy && ` bởi ${message.repliedBy}`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Hành động nhanh</h2>
            <div className="mt-4 space-y-3">
              <a
                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-3 font-semibold text-white hover:bg-brand-navy/90"
              >
                <Mail className="h-5 w-5" />
                Gửi email trả lời
              </a>
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Phone className="h-5 w-5" />
                  Gọi điện
                </a>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-brand-gold" />
              Cập nhật trạng thái
            </h2>

            <form action={updateStatus} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={message.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  defaultValue={message.status}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                >
                  <option value="NEW">Mới</option>
                  <option value="READ">Đã đọc</option>
                  <option value="REPLIED">Đã trả lời</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú phản hồi (nếu đã trả lời)
                </label>
                <textarea
                  name="replyNote"
                  rows={3}
                  defaultValue={message.replyNote || ''}
                  placeholder="Ghi lại nội dung đã trả lời..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-gold px-4 py-2 font-semibold text-brand-navy hover:bg-brand-gold/90"
              >
                Cập nhật
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tin nhắn được gửi</p>
                  <p className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              {message.repliedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Reply className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã phản hồi</p>
                    <p className="text-sm text-gray-500">
                      {new Date(message.repliedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
