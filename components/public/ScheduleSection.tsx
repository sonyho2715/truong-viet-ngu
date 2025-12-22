'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const scheduleItems = [
  {
    time: '12:30 PM',
    title: 'Học Việt Ngữ',
    description: 'Các lớp từ Mẫu Giáo đến Cấp 6',
    duration: '2 tiếng',
    color: 'bg-red-700',
  },
  {
    time: '2:30 PM',
    title: 'Sinh hoạt TNTT',
    description: 'Thiếu Nhi Thánh Thể - theo ngành đoàn',
    duration: '1 tiếng 30 phút',
    color: 'bg-yellow-500',
  },
  {
    time: '4:00 PM',
    title: 'Thánh Lễ',
    description: 'Thánh Lễ Chúa Nhật bằng tiếng Việt',
    duration: '1 tiếng',
    color: 'bg-blue-600',
  },
];

const upcomingEvents = [
  {
    date: '05',
    month: 'Jan',
    title: 'Khai Giảng Năm Học Mới',
    time: '12:30 PM',
  },
  {
    date: '26',
    month: 'Jan',
    title: 'Tết Nguyên Đán - Nghỉ Học',
    time: 'Cả ngày',
  },
  {
    date: '02',
    month: 'Feb',
    title: 'Mừng Xuân Ất Tỵ',
    time: '12:00 PM',
  },
];

export function ScheduleSection() {
  const { language } = useLanguage();

  const content = {
    vi: {
      sectionLabel: 'Thời Khóa Biểu',
      title: 'Lịch Sinh Hoạt Chúa Nhật',
      subtitle: 'Mỗi Chúa Nhật tại Nhà Thờ Các Thánh Tử Đạo Việt Nam',
      eventsTitle: 'Sự Kiện Sắp Tới',
      viewCalendar: 'Xem Lịch Đầy Đủ',
      location: '2250 Kuhio Ave, Honolulu, HI 96815',
    },
    en: {
      sectionLabel: 'Schedule',
      title: 'Sunday Schedule',
      subtitle: 'Every Sunday at Vietnamese Martyrs Church',
      eventsTitle: 'Upcoming Events',
      viewCalendar: 'View Full Calendar',
      location: '2250 Kuhio Ave, Honolulu, HI 96815',
    },
  };

  const t = content[language];

  return (
    <section id="schedule" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-red-700 font-bold tracking-wider uppercase text-sm">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">
            {t.title}
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-600 mt-3">
            <MapPin size={16} className="text-red-700" />
            <span className="text-sm">{t.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timeline - Left Side */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

              {/* Schedule Items */}
              <div className="space-y-8">
                {scheduleItems.map((item, index) => (
                  <div key={index} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-2 top-1 w-5 h-5 rounded-full ${item.color} border-4 border-white shadow-md`}
                    />

                    {/* Content Card */}
                    <div className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock size={14} />
                          <span className="font-semibold text-red-700">
                            {item.time}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events Sidebar - Right Side */}
          <div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-yellow-400" size={20} />
                <h3 className="text-lg font-bold text-white">{t.eventsTitle}</h3>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Date Box */}
                    <div className="bg-red-700 text-white rounded-lg p-2 text-center min-w-[56px]">
                      <span className="block text-2xl font-bold leading-none">
                        {event.date}
                      </span>
                      <span className="block text-xs uppercase mt-1">
                        {event.month}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {event.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/calendar"
                className="block text-center text-yellow-400 font-semibold text-sm mt-6 hover:text-yellow-300 transition-colors"
              >
                {t.viewCalendar} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
