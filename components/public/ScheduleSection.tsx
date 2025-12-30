'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

const scheduleItemKeys = ['vietnamese', 'tntt', 'mass'] as const;
const scheduleItemTimes = ['12:30 PM', '2:30 PM', '4:00 PM'] as const;
const scheduleItemColors = ['bg-red-700', 'bg-yellow-500', 'bg-blue-600'] as const;

export function ScheduleSection() {
  const { t } = useLanguage();

  return (
    <section id="schedule" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-red-700 font-bold tracking-wider uppercase text-sm">
            {t('home.schedule.sectionLabel')}
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">
            {t('home.schedule.title')}
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            {t('home.schedule.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-600 mt-3">
            <MapPin size={16} className="text-red-700" />
            <span className="text-sm">{t('home.schedule.location')}</span>
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
                {scheduleItemKeys.map((key, index) => (
                  <div key={key} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-2 top-1 w-5 h-5 rounded-full ${scheduleItemColors[index]} border-4 border-white shadow-md`}
                    />

                    {/* Content Card */}
                    <div className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {t(`home.schedule.items.${key}.title` as TranslationKey)}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock size={14} />
                          <span className="font-semibold text-red-700">
                            {scheduleItemTimes[index]}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{t(`home.schedule.items.${key}.duration` as TranslationKey)}</span>
                        </div>
                      </div>
                      <p className="text-slate-600">
                        {t(`home.schedule.items.${key}.description` as TranslationKey)}
                      </p>
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
                <h3 className="text-lg font-bold text-white">
                  {t('home.schedule.eventsTitle')}
                </h3>
              </div>

              {/* Note: Events will be fetched from database/API in future */}
              <div className="text-center py-4">
                <p className="text-slate-400 text-sm">
                  {t('calendar.noEvents')}
                </p>
              </div>

              <Link
                href="/calendar"
                className="block text-center text-yellow-400 font-semibold text-sm mt-6 hover:text-yellow-300 transition-colors"
              >
                {t('home.schedule.viewCalendar')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
