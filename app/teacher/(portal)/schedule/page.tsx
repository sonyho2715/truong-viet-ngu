import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

export default async function TeacherSchedulePage() {
  const session = await requireTeacherAuth();

  // Get teacher's classes for schedule display
  const classes = await db.class.findMany({
    where: {
      teacherId: session.teacherId,
      isActive: true,
    },
    orderBy: { name: 'asc' },
  });

  // Get upcoming events
  const upcomingEvents = await db.calendarEvent.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: { startDate: 'asc' },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch Dạy</h1>
        <p className="mt-1 text-sm text-gray-600">
          Xem lịch giảng dạy và sự kiện sắp tới
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Classes Schedule */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Lớp học hàng tuần</h2>
          <p className="mt-1 text-sm text-gray-500">
            Các lớp bạn đang phụ trách
          </p>

          {classes.length > 0 ? (
            <div className="mt-4 space-y-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
                >
                  <div className="rounded-lg bg-brand-gold/20 p-3">
                    <Clock className="h-5 w-5 text-brand-navy" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cls.gradeLevel}
                      {cls.roomNumber && ` • Phòng ${cls.roomNumber}`}
                    </p>
                  </div>
                  <Link
                    href={`/teacher/classes/${cls.id}`}
                    className="text-sm text-brand-navy hover:underline"
                  >
                    Chi tiết
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-gray-50 py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                Chưa có lớp học được phân công
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Sự kiện sắp tới</h2>
          <p className="mt-1 text-sm text-gray-500">
            Lịch các sự kiện quan trọng
          </p>

          {upcomingEvents.length > 0 ? (
            <div className="mt-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        event.eventType === 'HOLIDAY'
                          ? 'bg-red-100'
                          : event.eventType === 'SPECIAL_EVENT'
                          ? 'bg-blue-100'
                          : 'bg-green-100'
                      }`}
                    >
                      <Calendar
                        className={`h-5 w-5 ${
                          event.eventType === 'HOLIDAY'
                            ? 'text-red-600'
                            : event.eventType === 'SPECIAL_EVENT'
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {event.location && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-gray-50 py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                Không có sự kiện sắp tới
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Link */}
      <div className="rounded-xl bg-brand-navy/5 p-6 text-center">
        <p className="text-gray-600">
          Xem đầy đủ lịch học và sự kiện trên trang lịch công khai
        </p>
        <Link
          href="/calendar"
          className="mt-3 inline-block rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white hover:bg-brand-navy/90"
        >
          Xem lịch đầy đủ
        </Link>
      </div>
    </div>
  );
}
