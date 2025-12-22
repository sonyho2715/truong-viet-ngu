import Image from 'next/image';
import type { Class, Teacher } from '@prisma/client';

interface ClassesSectionProps {
  classes: (Class & {
    teacher: Pick<Teacher, 'id' | 'firstName' | 'lastName'> | null;
  })[];
}

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

export function ClassesSection({ classes }: ClassesSectionProps) {
  const activeClasses = classes
    .filter((c) => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeClasses.length === 0) {
    return null;
  }

  return (
    <section id="classes" className="bg-white px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-slate-900 lg:text-4xl">
            Các Lớp Học
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Mẫu Giáo A đến Lớp 7 và TNTT
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {activeClasses.map((classItem) => (
            <article
              key={classItem.id}
              className="group overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-yellow-400 hover:shadow-lg"
            >
              {/* Class Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                {classItem.classroomImage ? (
                  <Image
                    src={classItem.classroomImage}
                    alt={`${classItem.name} classroom`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-6xl font-bold text-yellow-400 opacity-30">
                      {gradeLevelLabels[classItem.gradeLevel]}
                    </span>
                  </div>
                )}
              </div>

              {/* Class Info */}
              <div className="p-6">
                <h3 className="mb-4 font-serif text-2xl font-bold text-slate-900 group-hover:text-red-700">
                  {classItem.name}
                </h3>

                <div className="space-y-3 text-sm text-slate-600">
                  {/* Teacher */}
                  {classItem.teacher && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        <strong>Giáo viên:</strong> {classItem.teacher.firstName}{' '}
                        {classItem.teacher.lastName}
                      </span>
                    </div>
                  )}

                  {/* Schedule */}
                  {classItem.schedule && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{classItem.schedule}</span>
                    </div>
                  )}

                  {/* Room Number */}
                  {classItem.roomNumber && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span>
                        <strong>Phòng:</strong> {classItem.roomNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description (if available) */}
                {classItem.description && (
                  <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                    {classItem.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
