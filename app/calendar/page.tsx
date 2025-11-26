import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Calendar, BookOpen, Users, Star, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Lịch Học - Trường Việt Ngữ',
  description: 'Lịch học và các hoạt động của Trường Việt Ngữ và Thiếu Nhi Thánh Thể tại Honolulu, HI. Xem thời khóa biểu các lớp và sự kiện đặc biệt.',
  keywords: ['lịch học', 'calendar', 'thời khóa biểu', 'Vietnamese school schedule'],
};

const eventTypeLabels: Record<string, string> = {
  CLASS: 'Lớp Học',
  TNTT: 'TNTT',
  HOLIDAY: 'Nghỉ Lễ',
  SPECIAL_EVENT: 'Sự Kiện Đặc Biệt',
  MASS: 'Thánh Lễ',
  MEETING: 'Họp',
};

const eventTypeColors: Record<string, string> = {
  CLASS: 'bg-blue-100 text-blue-800 border-blue-300',
  TNTT: 'bg-green-100 text-green-800 border-green-300',
  HOLIDAY: 'bg-red-100 text-red-800 border-red-300',
  SPECIAL_EVENT: 'bg-purple-100 text-purple-800 border-purple-300',
  MASS: 'bg-amber-100 text-amber-800 border-amber-300',
  MEETING: 'bg-gray-100 text-gray-800 border-gray-300',
};

const EventIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'CLASS':
      return <BookOpen className="h-5 w-5" />;
    case 'TNTT':
      return <Users className="h-5 w-5" />;
    case 'HOLIDAY':
      return <Clock className="h-5 w-5" />;
    case 'SPECIAL_EVENT':
      return <Star className="h-5 w-5" />;
    case 'MASS':
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'MEETING':
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatTimeRange(startTime?: string | null, endTime?: string | null) {
  if (!startTime) return null;
  if (endTime) return `${startTime} - ${endTime}`;
  return startTime;
}

export default async function CalendarPage() {
  // Fetch upcoming events from database
  const events = await db.calendarEvent.findMany({
    where: {
      isActive: true,
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    take: 20,
  });

  // Group events by month
  const eventsByMonth = events.reduce(
    (acc, event) => {
      const monthKey = new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
      }).format(event.startDate);
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(event);
      return acc;
    },
    {} as Record<string, typeof events>
  );

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: 'Lịch Học' }]} />
            <div className="text-center">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
              <h1 className="font-serif text-4xl font-bold text-white lg:text-5xl">
                Lịch Học
              </h1>
              <p className="mt-4 text-lg text-brand-cream lg:text-xl">
                Lịch học và các hoạt động của Trường Việt Ngữ và TNTT
              </p>
            </div>
          </div>
        </section>

        {/* Schedule Info Section */}
        <section className="bg-white px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Regular Classes */}
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Lớp Học Hàng Tuần
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Ngày:</strong> Chủ Nhật hàng tuần</p>
                  <p><strong>Giờ:</strong> 9:00 AM - 12:00 PM</p>
                  <p><strong>Lớp:</strong> Tất cả các lớp Việt Ngữ (MG-A đến Lớp 7)</p>
                </div>
              </div>

              {/* TNTT Activities */}
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Sinh Hoạt TNTT
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Ngày:</strong> Chủ Nhật hàng tuần</p>
                  <p><strong>Giờ:</strong> 9:00 AM - 12:00 PM</p>
                  <p><strong>Ngành:</strong> Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ, Hiệp Sĩ</p>
                </div>
              </div>

              {/* Special Events */}
              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Sự Kiện Đặc Biệt
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Lễ khai giảng, văn nghệ, cắm trại</p>
                  <p>Thánh lễ đặc biệt</p>
                  <p>Xem lịch chi tiết bên dưới</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Events Section */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-navy">
              Lịch Chi Tiết
            </h2>

            {events.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                  <div key={month}>
                    <h3 className="mb-4 border-b-2 border-brand-gold pb-2 font-serif text-xl font-bold capitalize text-brand-navy">
                      {month}
                    </h3>
                    <div className="space-y-4">
                      {monthEvents.map((event) => (
                        <article
                          key={event.id}
                          className={`group rounded-xl border-2 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg ${eventTypeColors[event.eventType]}`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                                <EventIcon type={event.eventType} />
                              </div>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1">
                              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <span className="mb-1 inline-block rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium">
                                    {eventTypeLabels[event.eventType]}
                                  </span>
                                  <h4 className="font-serif text-xl font-bold text-gray-900">
                                    {event.title}
                                  </h4>
                                </div>
                                {formatTimeRange(event.startTime, event.endTime) && (
                                  <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow">
                                    {formatTimeRange(event.startTime, event.endTime)}
                                  </span>
                                )}
                              </div>

                              <p className="mb-2 text-sm font-medium text-gray-700">
                                {formatDate(event.startDate)}
                                {event.endDate && event.endDate.toDateString() !== event.startDate.toDateString() && (
                                  <> - {formatDate(event.endDate)}</>
                                )}
                              </p>

                              {event.location && (
                                <p className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </p>
                              )}

                              {event.description && (
                                <p className="text-sm text-gray-600">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Calendar className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-600">
                  Chưa có sự kiện nào sắp tới
                </h3>
                <p className="mt-2 text-gray-500">
                  Các sự kiện và lịch học sẽ được cập nhật sớm.
                </p>
              </div>
            )}

            {/* Note */}
            <div className="mt-12 rounded-xl border-2 border-brand-gold bg-brand-cream p-6">
              <div className="flex items-start gap-4">
                <svg className="h-6 w-6 flex-shrink-0 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="mb-2 font-semibold text-brand-navy">Lưu Ý</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Lịch có thể thay đổi. Vui lòng kiểm tra thường xuyên.</li>
                    <li>• Liên hệ ban quản lý nếu có thắc mắc về lịch học.</li>
                    <li>• Học sinh cần đến đúng giờ và mang đầy đủ sách vở.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white transition-all hover:bg-brand-navy/90"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay Về Trang Chủ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
