import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import {
  Users,
  Calendar,
  BookOpen,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const metadata = {
  title: 'Tổng quan | Cổng Phụ Huynh',
};

export default async function ParentDashboardPage() {
  const parent = await getCurrentParent();

  if (!parent) {
    redirect('/parent/login');
  }

  // Get students linked to this parent
  const students = await db.student.findMany({
    where: { parentId: parent.parentId },
    include: {
      enrollments: {
        where: { status: 'ACTIVE' },
        include: { class: true },
      },
      attendance: {
        orderBy: { date: 'desc' },
        take: 5,
      },
      grades: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  // Get recent announcements
  const announcements = await db.announcement.findMany({
    where: { isActive: true },
    orderBy: { startDate: 'desc' },
    take: 3,
  });

  // Calculate attendance stats
  const attendanceStats = students.reduce((acc, student) => {
    const present = student.attendance.filter(a => a.status === 'PRESENT').length;
    const absent = student.attendance.filter(a => a.status === 'ABSENT').length;
    const late = student.attendance.filter(a => a.status === 'LATE').length;
    return {
      present: acc.present + present,
      absent: acc.absent + absent,
      late: acc.late + late,
    };
  }, { present: 0, absent: 0, late: 0 });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 p-6 text-white">
        <h1 className="font-serif text-2xl font-bold">
          Xin chào, {parent.lastName} {parent.firstName}!
        </h1>
        <p className="mt-2 text-brand-cream">
          Chào mừng đến với Cổng Thông Tin Phụ Huynh của Trường Việt Ngữ.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-600">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.present}</p>
              <p className="text-sm text-gray-600">Có mặt</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.absent}</p>
              <p className="text-sm text-gray-600">Vắng mặt</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.late}</p>
              <p className="text-sm text-gray-600">Đi trễ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students Overview */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="font-serif text-lg font-bold text-gray-900">Học sinh của bạn</h2>
            <Link
              href="/parent/students"
              className="flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-4">
            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">Chưa có học sinh nào được liên kết</p>
                <p className="mt-1 text-sm text-gray-400">
                  Liên hệ nhà trường để liên kết hồ sơ học sinh
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy">
                        <GraduationCap className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.lastName} {student.firstName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.enrollments[0]?.class.name || 'Chưa xếp lớp'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/parent/students/${student.id}`}
                      className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-brand-navy border border-gray-200 hover:bg-gray-50"
                    >
                      Chi tiết
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="font-serif text-lg font-bold text-gray-900">Thông báo mới</h2>
            <Link
              href="/parent/announcements"
              className="flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-4">
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">Chưa có thông báo mới</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-1.5 ${
                        announcement.priority >= 10
                          ? 'bg-red-100'
                          : announcement.priority >= 5
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}>
                        <Bell className={`h-4 w-4 ${
                          announcement.priority >= 10
                            ? 'text-red-600'
                            : announcement.priority >= 5
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {announcement.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {announcement.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {announcement.startDate.toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/parent/attendance"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="rounded-lg bg-green-100 p-3">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Điểm danh</p>
            <p className="text-sm text-gray-500">Xem lịch sử điểm danh</p>
          </div>
        </Link>
        <Link
          href="/parent/grades"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="rounded-lg bg-blue-100 p-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Điểm số</p>
            <p className="text-sm text-gray-500">Xem kết quả học tập</p>
          </div>
        </Link>
        <Link
          href="/parent/reports"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="rounded-lg bg-purple-100 p-3">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Phiếu liên lạc</p>
            <p className="text-sm text-gray-500">Xem đánh giá tổng hợp</p>
          </div>
        </Link>
        <Link
          href="/calendar"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-gold hover:shadow-sm"
        >
          <div className="rounded-lg bg-yellow-100 p-3">
            <Calendar className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Lịch sự kiện</p>
            <p className="text-sm text-gray-500">Xem lịch của trường</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
