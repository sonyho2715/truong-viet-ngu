'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Class, Teacher } from '@prisma/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

interface ClassesSectionProps {
  classes: (Class & {
    teacher: Pick<Teacher, 'id' | 'firstName' | 'lastName'> | null;
  })[];
}

// Default program keys for when database is empty
const defaultProgramKeys = ['kindergarten', 'primary', 'advanced'] as const;

const programConfigs = {
  kindergarten: {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022',
    featured: false,
  },
  primary: {
    image: 'https://images.unsplash.com/photo-1427504746074-be4799b9e613?q=80&w=1000',
    featured: true,
  },
  advanced: {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
    featured: false,
  },
};

export function ClassesSection({ classes }: ClassesSectionProps) {
  const { t } = useLanguage();

  const activeClasses = classes
    .filter((c) => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Use default programs if no classes
  const showDefaults = activeClasses.length === 0;

  // Helper to get grade level label with type assertion for dynamic keys
  const getGradeLevelLabel = (gradeLevel: string) => {
    const key = `home.gradeLevels.${gradeLevel}` as TranslationKey;
    const translated = t(key);
    // If translation returns the key itself, use the original gradeLevel
    return translated === key ? gradeLevel : translated;
  };

  return (
    <section id="programs" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-red-700 font-bold tracking-wider uppercase text-sm">
              {t('home.classes.label')}
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">
              {t('home.classes.title')}
            </h2>
          </div>
          <p className="text-slate-500 max-w-md">
            {t('home.classes.schedule')}
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showDefaults ? (
            // Show default programs
            defaultProgramKeys.map((programKey) => {
              const config = programConfigs[programKey];
              return (
                <article
                  key={programKey}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group ${
                    config.featured ? 'border-b-4 border-red-700' : ''
                  }`}
                >
                  <div className="h-48 bg-slate-200 relative">
                    <Image
                      src={config.image}
                      alt={t(`home.classes.defaultPrograms.${programKey}.name`)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded text-xs font-bold ${
                      config.featured
                        ? 'bg-red-700/90 text-white'
                        : 'bg-white/90 text-slate-800'
                    }`}>
                      {t(`home.classes.defaultPrograms.${programKey}.ageRange`)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {t(`home.classes.defaultPrograms.${programKey}.name`)}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                      {t(`home.classes.defaultPrograms.${programKey}.description`)}
                    </p>
                    <Link
                      href="/about"
                      className="text-red-700 font-bold text-sm hover:underline"
                    >
                      {t('home.classes.viewDetails')} &rarr;
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            // Show database classes
            activeClasses.map((classItem) => (
              <article
                key={classItem.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-48 bg-slate-200 relative">
                  {classItem.classroomImage ? (
                    <Image
                      src={classItem.classroomImage}
                      alt={`${classItem.name} classroom`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <span className="font-serif text-4xl font-bold text-yellow-400/30">
                        {getGradeLevelLabel(classItem.gradeLevel)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-slate-800">
                    {getGradeLevelLabel(classItem.gradeLevel)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {classItem.name}
                  </h3>

                  {/* Teacher */}
                  {classItem.teacher && (
                    <p className="text-slate-500 text-sm mb-2">
                      {t('home.classes.teacher')}: {classItem.teacher.firstName} {classItem.teacher.lastName}
                    </p>
                  )}

                  {/* Schedule */}
                  {classItem.schedule && (
                    <p className="text-slate-500 text-sm mb-2">
                      {classItem.schedule}
                    </p>
                  )}

                  {classItem.description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {classItem.description}
                    </p>
                  )}

                  <Link
                    href="/about"
                    className="text-red-700 font-bold text-sm hover:underline"
                  >
                    {t('home.classes.viewDetails')} &rarr;
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
