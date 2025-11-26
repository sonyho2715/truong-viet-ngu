import Link from 'next/link';
import { BookOpen, Users, Calendar, FileText, Clock, Bell } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

export default async function TeacherDashboardPage() {
  const session = await requireTeacherAuth();

  // Fetch teacher's data
  const teacher = await db.teacher.findUnique({
    where: { id: session.teacherId },
    include: {
      classes: {
        where: { isActive: true },
        include: {
          _count: {
            select: { enrollments: true },
          },
        },
      },
    },
  });

  // Fetch upcoming events
  const upcomingEvents = await db.calendarEvent.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: { startDate: 'asc' },
    take: 5,
  });

  // Fetch recent announcements
  const recentAnnouncements = await db.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const totalStudents =
    teacher?.classes.reduce((acc, cls) => acc + cls._count.enrollments, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Xin chào, {teacher?.firstName} {teacher?.lastName}!
        </h1>
        <p className="mt-2 text-brand-cream/80">
          Chào mừng bạn đến với cổng giáo viên Trường Việt Ngữ.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lớp đang dạy</p>
              <p className="text-2xl font-bold text-gray-900">
                {teacher?.classes.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng học sinh</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sự kiện sắp tới</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Thông báo mới</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentAnnouncements.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Classes */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Lớp của tôi
            </h2>
            <Link
              href="/teacher/classes"
              className="text-sm text-brand-navy hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          {teacher?.classes && teacher.classes.length > 0 ? (
            <div className="space-y-3">
              {teacher.classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cls.gradeLevel} &bull; {cls._count.enrollments} học sinh
                    </p>
                  </div>
                  <Link
                    href={`/teacher/classes/${cls.id}`}
                    className="rounded-lg bg-brand-navy/10 px-3 py-1 text-sm font-medium text-brand-navy hover:bg-brand-navy/20"
                  >
                    Chi tiết
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">
                Bạn chưa được phân công lớp nào
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Sự kiện sắp tới
            </h2>
            <Link
              href="/teacher/schedule"
              className="text-sm text-brand-navy hover:underline"
            >
              Xem lịch
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-4"
                >
                  <div className="rounded-lg bg-brand-gold/20 p-2">
                    <Clock className="h-5 w-5 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">Không có sự kiện sắp tới</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-gray-900">
            Thông báo mới nhất
          </h2>
        </div>

        {recentAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="rounded-lg bg-red-100 p-2">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {announcement.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {announcement.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Không có thông báo mới</p>
          </div>
        )}
      </div>
    </div>
  );
}
