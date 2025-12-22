import Image from 'next/image';
import Link from 'next/link';
import type { Class, Teacher } from '@prisma/client';

interface ClassesSectionProps {
  classes: (Class & {
    teacher: Pick<Teacher, 'id' | 'firstName' | 'lastName'> | null;
  })[];
}

// Default programs for when database is empty
const defaultPrograms = [
  {
    id: 'kindergarten',
    name: 'Lớp Mẫu Giáo & Vỡ Lòng',
    ageRange: '4-6 Tuổi',
    description: 'Làm quen với bảng chữ cái, các dấu giọng qua bài hát và trò chơi. Tập tô màu và nhận biết đồ vật.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022',
    featured: false,
  },
  {
    id: 'primary',
    name: 'Cấp 1 - Cấp 3',
    ageRange: 'Căn Bản',
    description: 'Học đánh vần, tập đọc và chính tả. Bắt đầu tập viết câu ngắn và đọc hiểu các đoạn văn đơn giản.',
    image: 'https://images.unsplash.com/photo-1427504746074-be4799b9e613?q=80&w=1000',
    featured: true,
  },
  {
    id: 'advanced',
    name: 'Cấp 4 - Cấp 6',
    ageRange: 'Nâng Cao',
    description: 'Tập làm văn, tìm hiểu lịch sử, địa lý Việt Nam. Thảo luận về văn hóa và phong tục tập quán.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
    featured: false,
  },
];

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

  // Use default programs if no classes
  const showDefaults = activeClasses.length === 0;

  return (
    <section id="programs" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-red-700 font-bold tracking-wider uppercase text-sm">
              Chương Trình Đào Tạo
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">
              Các Cấp Lớp
            </h2>
          </div>
          <p className="text-slate-500 max-w-md">
            Chương trình học diễn ra vào mỗi trưa Chúa Nhật, từ 12:30 PM đến 2:30 PM, trước giờ sinh hoạt TNTT.
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showDefaults ? (
            // Show default programs
            defaultPrograms.map((program) => (
              <article
                key={program.id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group ${
                  program.featured ? 'border-b-4 border-red-700' : ''
                }`}
              >
                <div className="h-48 bg-slate-200 relative">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded text-xs font-bold ${
                    program.featured
                      ? 'bg-red-700/90 text-white'
                      : 'bg-white/90 text-slate-800'
                  }`}>
                    {program.ageRange}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {program.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  <Link
                    href="/about"
                    className="text-red-700 font-bold text-sm hover:underline"
                  >
                    Xem chi tiết &rarr;
                  </Link>
                </div>
              </article>
            ))
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
                        {gradeLevelLabels[classItem.gradeLevel]}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-slate-800">
                    {gradeLevelLabels[classItem.gradeLevel]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {classItem.name}
                  </h3>

                  {/* Teacher */}
                  {classItem.teacher && (
                    <p className="text-slate-500 text-sm mb-2">
                      Giáo viên: {classItem.teacher.firstName} {classItem.teacher.lastName}
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
                    Xem chi tiết &rarr;
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
