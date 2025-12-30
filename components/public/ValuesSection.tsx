'use client';

import { BookOpen, Heart, Users } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

const valueConfigs = [
  {
    key: 'language',
    icon: BookOpen,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-100',
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    key: 'culture',
    icon: Heart,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    key: 'faith',
    icon: Users,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
];

export function ValuesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">
            {t('home.values.title')}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('home.values.description')}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueConfigs.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className={`p-8 rounded-2xl ${value.bgColor} border ${value.borderColor} text-center hover:shadow-lg transition-shadow`}
              >
                <div className={`w-16 h-16 mx-auto ${value.iconBgColor} rounded-full flex items-center justify-center ${value.iconColor} mb-4`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t(`home.values.${value.key}.title` as TranslationKey)}
                </h3>
                <p className="text-slate-600">
                  {t(`home.values.${value.key}.description` as TranslationKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
