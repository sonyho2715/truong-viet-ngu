import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { RegistrationStatus, GradeLevel } from '@prisma/client';
import {
  User,
  Users,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Chi tiết đơn đăng ký | Trang quản trị',
};

const gradeLevelLabels: Record<string, string> = {
  MAU_GIAO_A: 'Mẫu Giáo A',
  MAU_GIAO_B: 'Mẫu Giáo B',
  MAU_GIAO_C: 'Mẫu Giáo C',
  LOP_1: 'Lớp 1',
  LOP_2: 'Lớp 2',
  LOP_3: 'Lớp 3',
  LOP_4: 'Lớp 4',
  LOP_5: 'Lớp 5',
  LOP_6: 'Lớp 6',
  LOP_7: 'Lớp 7',
  AU_NHI: 'Ấu Nhi',
  THIEU_NHI: 'Thiếu Nhi',
  NGHIA_SI: 'Nghĩa Sĩ',
  HIEP_SI: 'Hiệp Sĩ',
};

const statusConfig: Record<RegistrationStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'Chờ xử lý', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
  UNDER_REVIEW: { label: 'Đang xem xét', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  APPROVED: { label: 'Đã duyệt', color: 'text-green-800', bgColor: 'bg-green-100' },
  WAITLISTED: { label: 'Danh sách chờ', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  REJECTED: { label: 'Từ chối', color: 'text-red-800', bgColor: 'bg-red-100' },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function updateStatus(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;
  const status = formData.get('status') as RegistrationStatus;
  const reviewNotes = formData.get('reviewNotes') as string;

  await db.registrationApplication.update({
    where: { id },
    data: {
      status,
      reviewNotes: reviewNotes || null,
      reviewedAt: new Date(),
      reviewedBy: 'Admin', // In a real app, get from session
    },
  });

  revalidatePath('/admin/dashboard/registrations');
  revalidatePath(`/admin/dashboard/registrations/${id}`);
}

async function createStudentFromApplication(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;

  const app = await db.registrationApplication.findUnique({
    where: { id },
  });

  if (!app || app.status !== 'APPROVED') {
    throw new Error('Đơn chưa được duyệt');
  }

  // Create the student
  await db.student.create({
    data: {
      firstName: app.studentFirstName,
      lastName: app.studentLastName,
      dateOfBirth: app.studentDOB,
      gradeLevel: app.preferredGrade as GradeLevel | null,
      parentName: `${app.parentFirstName} ${app.parentLastName}`,
      parentEmail: app.parentEmail,
      parentPhone: app.parentPhone,
      address: `${app.address}, ${app.city}, ${app.state} ${app.zipCode}`,
      emergencyContact: `${app.emergencyName} (${app.emergencyRelation}): ${app.emergencyPhone}`,
      notes: [
        app.medicalNotes ? `Y tế: ${app.medicalNotes}` : null,
        app.allergies ? `Dị ứng: ${app.allergies}` : null,
        app.specialNeeds ? `Nhu cầu đặc biệt: ${app.specialNeeds}` : null,
      ].filter(Boolean).join('\n'),
      isActive: true,
    },
  });

  redirect('/admin/dashboard/students');
}

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const application = await db.registrationApplication.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  const status = statusConfig[application.status];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Back Link */}
      <Link
        href="/admin/dashboard/registrations"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            {application.studentFirstName} {application.studentLastName}
          </h1>
          <p className="mt-2 text-gray-600">
            Đơn đăng ký ngày {new Date(application.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium ${status.bgColor} ${status.color}`}>
          {application.status === 'PENDING' && <Clock className="h-5 w-5" />}
          {application.status === 'UNDER_REVIEW' && <AlertCircle className="h-5 w-5" />}
          {application.status === 'APPROVED' && <CheckCircle className="h-5 w-5" />}
          {application.status === 'REJECTED' && <XCircle className="h-5 w-5" />}
          {status.label}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Student Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5 text-brand-gold" />
              Thông tin học sinh
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium text-gray-900">
                  {application.studentFirstName} {application.studentLastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-medium text-gray-900">
                  {new Date(application.studentDOB).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lớp đăng ký</p>
                <p className="font-medium text-gray-900">
                  {application.preferredGrade
                    ? gradeLevelLabels[application.preferredGrade]
                    : 'Để trường xếp lớp'}
                </p>
              </div>
              {application.previousSchool && (
                <div>
                  <p className="text-sm text-gray-500">Trường trước đây</p>
                  <p className="font-medium text-gray-900">{application.previousSchool}</p>
                </div>
              )}
            </div>
          </div>

          {/* Parent Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Users className="h-5 w-5 text-brand-gold" />
              Thông tin phụ huynh
            </h2>

            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">Phụ huynh chính</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="font-medium text-gray-900">
                    {application.parentFirstName} {application.parentLastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quan hệ</p>
                  <p className="font-medium text-gray-900">{application.parentRelation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${application.parentEmail}`} className="text-brand-navy hover:underline">
                    {application.parentEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${application.parentPhone}`} className="text-brand-navy hover:underline">
                    {application.parentPhone}
                  </a>
                </div>
              </div>
            </div>

            {application.parent2FirstName && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900">Phụ huynh phụ</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium text-gray-900">
                      {application.parent2FirstName} {application.parent2LastName}
                    </p>
                  </div>
                  {application.parent2Relation && (
                    <div>
                      <p className="text-sm text-gray-500">Quan hệ</p>
                      <p className="font-medium text-gray-900">{application.parent2Relation}</p>
                    </div>
                  )}
                  {application.parent2Email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${application.parent2Email}`} className="text-brand-navy hover:underline">
                        {application.parent2Email}
                      </a>
                    </div>
                  )}
                  {application.parent2Phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${application.parent2Phone}`} className="text-brand-navy hover:underline">
                        {application.parent2Phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5 text-brand-gold" />
              Địa chỉ
            </h2>
            <p className="mt-4 text-gray-900">
              {application.address}<br />
              {application.city}, {application.state} {application.zipCode}
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Liên hệ khẩn cấp
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-medium text-gray-900">{application.emergencyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quan hệ</p>
                <p className="font-medium text-gray-900">{application.emergencyRelation}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${application.emergencyPhone}`} className="text-brand-navy hover:underline">
                  {application.emergencyPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(application.medicalNotes || application.allergies || application.specialNeeds || application.additionalNotes) && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-brand-gold" />
                Thông tin thêm
              </h2>
              <div className="mt-4 space-y-4">
                {application.medicalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ghi chú y tế</p>
                    <p className="mt-1 text-gray-600">{application.medicalNotes}</p>
                  </div>
                )}
                {application.allergies && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dị ứng</p>
                    <p className="mt-1 text-gray-600">{application.allergies}</p>
                  </div>
                )}
                {application.specialNeeds && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nhu cầu đặc biệt</p>
                    <p className="mt-1 text-gray-600">{application.specialNeeds}</p>
                  </div>
                )}
                {application.howHeard && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Biết đến trường qua</p>
                    <p className="mt-1 text-gray-600">{application.howHeard}</p>
                  </div>
                )}
                {application.additionalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ghi chú khác</p>
                    <p className="mt-1 text-gray-600">{application.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Calendar className="h-5 w-5 text-brand-gold" />
              Cập nhật trạng thái
            </h2>

            <form action={updateStatus} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={application.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  defaultValue={application.status}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="UNDER_REVIEW">Đang xem xét</option>
                  <option value="APPROVED">Duyệt</option>
                  <option value="WAITLISTED">Danh sách chờ</option>
                  <option value="REJECTED">Từ chối</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea
                  name="reviewNotes"
                  rows={3}
                  defaultValue={application.reviewNotes || ''}
                  placeholder="Ghi chú nội bộ..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-navy px-4 py-2 font-semibold text-white hover:bg-brand-navy/90"
              >
                Cập nhật
              </button>
            </form>

            {application.reviewedAt && (
              <p className="mt-4 text-sm text-gray-500">
                Cập nhật lần cuối: {new Date(application.reviewedAt).toLocaleString('vi-VN')}
                {application.reviewedBy && ` bởi ${application.reviewedBy}`}
              </p>
            )}
          </div>

          {/* Create Student */}
          {application.status === 'APPROVED' && (
            <div className="rounded-xl bg-green-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-green-900">
                <CheckCircle className="h-5 w-5" />
                Tạo học sinh
              </h2>
              <p className="mt-2 text-sm text-green-700">
                Đơn đã được duyệt. Tạo hồ sơ học sinh từ thông tin đăng ký.
              </p>
              <form action={createStudentFromApplication} className="mt-4">
                <input type="hidden" name="id" value={application.id} />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                >
                  Tạo hồ sơ học sinh
                </button>
              </form>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/10">
                  <FileText className="h-4 w-4 text-brand-navy" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Đơn được gửi</p>
                  <p className="text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              {application.reviewedAt && (
                <div className="flex gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    application.status === 'APPROVED' ? 'bg-green-100' :
                    application.status === 'REJECTED' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {application.status === 'APPROVED' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {application.status === 'REJECTED' && <XCircle className="h-4 w-4 text-red-600" />}
                    {application.status !== 'APPROVED' && application.status !== 'REJECTED' && (
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {statusConfig[application.status].label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(application.reviewedAt).toLocaleString('vi-VN')}
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
