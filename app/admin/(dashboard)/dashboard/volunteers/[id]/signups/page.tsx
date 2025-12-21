import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ArrowLeft, Mail, Phone, Calendar, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { VolunteerStatus } from '@prisma/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const opportunity = await db.volunteerOpportunity.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: opportunity ? `Đăng ký - ${opportunity.title} | Trang quản trị` : 'Không tìm thấy',
  };
}

async function updateSignupStatus(formData: FormData) {
  'use server';

  await requireAuth();

  const signupId = formData.get('signupId') as string;
  const status = formData.get('status') as VolunteerStatus;
  const opportunityId = formData.get('opportunityId') as string;

  await db.volunteerSignup.update({
    where: { id: signupId },
    data: { status },
  });

  revalidatePath(`/admin/dashboard/volunteers/${opportunityId}/signups`);
}

const statusConfig: Record<VolunteerStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  DECLINED: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800', icon: Award },
};

export default async function SignupsPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  const opportunity = await db.volunteerOpportunity.findUnique({
    where: { id },
    include: {
      signups: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!opportunity) {
    notFound();
  }

  const statusCounts = {
    PENDING: opportunity.signups.filter((s) => s.status === 'PENDING').length,
    CONFIRMED: opportunity.signups.filter((s) => s.status === 'CONFIRMED').length,
    DECLINED: opportunity.signups.filter((s) => s.status === 'DECLINED').length,
    COMPLETED: opportunity.signups.filter((s) => s.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/volunteers"
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Danh sách đăng ký</h1>
          <p className="mt-1 text-gray-600">{opportunity.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {(Object.entries(statusCounts) as [VolunteerStatus, number][]).map(([status, count]) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <div key={status} className={`rounded-xl p-4 ${config.color.replace('text-', 'bg-').replace('-800', '-50')}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${config.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                  <Icon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm">{config.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signups List */}
      {opportunity.signups.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có ai đăng ký
          </h3>
          <p className="mt-2 text-gray-600">
            Khi có người đăng ký tình nguyện, họ sẽ xuất hiện ở đây.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tình nguyện viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {opportunity.signups.map((signup) => {
                const config = statusConfig[signup.status];
                return (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {signup.firstName} {signup.lastName}
                        </p>
                        {signup.notes && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{signup.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${signup.email}`} className="hover:text-brand-gold">
                            {signup.email}
                          </a>
                        </div>
                        {signup.phone && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${signup.phone}`} className="hover:text-brand-gold">
                              {signup.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(signup.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <form action={updateSignupStatus} className="inline-flex gap-1">
                        <input type="hidden" name="signupId" value={signup.id} />
                        <input type="hidden" name="opportunityId" value={opportunity.id} />
                        {signup.status !== 'CONFIRMED' && (
                          <button
                            type="submit"
                            name="status"
                            value="CONFIRMED"
                            className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                            title="Xác nhận"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {signup.status !== 'DECLINED' && (
                          <button
                            type="submit"
                            name="status"
                            value="DECLINED"
                            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                            title="Từ chối"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {signup.status === 'CONFIRMED' && (
                          <button
                            type="submit"
                            name="status"
                            value="COMPLETED"
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                            title="Hoàn thành"
                          >
                            <Award className="h-4 w-4" />
                          </button>
                        )}
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          href={`/admin/dashboard/volunteers/${opportunity.id}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Chỉnh sửa cơ hội
        </Link>
      </div>
    </div>
  );
}
