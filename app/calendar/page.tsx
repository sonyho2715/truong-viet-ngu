import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { EventCard } from '@/components/public/EventCard';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Calendar, BookOpen, Users, Star, Clock } from 'lucide-react';

export const metadata = {
  title: 'Lịch Học - Trường Việt Ngữ',
  description: 'Lịch học và các hoạt động của Trường Việt Ngữ và Thiếu Nhi Thánh Thể tại Honolulu, HI. Xem thời khóa biểu các lớp và sự kiện đặc biệt.',
  keywords: ['lịch học', 'calendar', 'thời khóa biểu', 'Vietnamese school schedule'],
};


export default async function CalendarPage() {
  // Fetch upcoming events from database with RSVP counts
  const events = await db.calendarEvent.findMany({
    where: {
      isActive: true,
      startDate: {
        gte: new Date(),
      },
    },
    include: {
      _count: {
        select: { rsvps: true },
      },
      rsvps: {
        select: { numberOfGuests: true },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    take: 20,
  });

  // Calculate total guest count for each event
  const eventsWithCounts = events.map((event) => ({
    ...event,
    rsvpCount: event.rsvps.reduce((sum, r) => sum + r.numberOfGuests, 0),
  }));

  // Group events by month
  const eventsByMonth = eventsWithCounts.reduce(
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
    {} as Record<string, typeof eventsWithCounts>
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

            {eventsWithCounts.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                  <div key={month}>
                    <h3 className="mb-4 border-b-2 border-brand-gold pb-2 font-serif text-xl font-bold capitalize text-brand-navy">
                      {month}
                    </h3>
                    <div className="space-y-4">
                      {monthEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={{
                            id: event.id,
                            title: event.title,
                            description: event.description,
                            eventType: event.eventType,
                            startDate: event.startDate.toISOString(),
                            endDate: event.endDate?.toISOString() || null,
                            startTime: event.startTime,
                            endTime: event.endTime,
                            location: event.location,
                            allowRSVP: event.allowRSVP,
                            maxAttendees: event.maxAttendees,
                            rsvpCount: event.rsvpCount,
                          }}
                        />
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
