import Link from 'next/link';
import { ExternalLink, FileText, BookOpen, Download } from 'lucide-react';
import { db } from '@/lib/db';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata = {
  title: 'Tài Liệu Học Tập | Trường Việt Ngữ',
  description: 'Tài liệu học tập tiếng Việt cho các lớp từ Mẫu Giáo đến Lớp 7',
};

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

const gradeLevelOrder = [
  'MAU_GIAO_A',
  'MAU_GIAO_B',
  'MAU_GIAO_C',
  'LOP_1',
  'LOP_2',
  'LOP_3',
  'LOP_4',
  'LOP_5',
  'LOP_6',
  'LOP_7',
  'AU_NHI',
  'THIEU_NHI',
  'NGHIA_SI',
  'HIEP_SI',
];

export default async function MaterialsPage() {
  const materials = await db.learningMaterial.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: 'asc' }],
  });

  // Group materials by grade level
  const materialsByGrade = materials.reduce(
    (acc, material) => {
      const grade = material.gradeLevel;
      if (!acc[grade]) {
        acc[grade] = [];
      }
      acc[grade].push(material);
      return acc;
    },
    {} as Record<string, typeof materials>
  );

  // Sort grades by order
  const sortedGrades = Object.keys(materialsByGrade).sort(
    (a, b) => gradeLevelOrder.indexOf(a) - gradeLevelOrder.indexOf(b)
  );

  // Separate Vietnamese classes and TNTT
  const vietnameseGrades = sortedGrades.filter(
    (g) => !['AU_NHI', 'THIEU_NHI', 'NGHIA_SI', 'HIEP_SI'].includes(g)
  );
  const tnttGrades = sortedGrades.filter((g) =>
    ['AU_NHI', 'THIEU_NHI', 'NGHIA_SI', 'HIEP_SI'].includes(g)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900/90 py-16 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Tài Liệu Học Tập' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Tài Liệu Học Tập
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Tài liệu học tiếng Việt và giáo lý cho các em học sinh
            </p>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="border-b border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center font-serif text-2xl font-bold text-slate-900">
              Tài Nguyên Học Tập Trực Tuyến
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="https://www.tomathien.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border-2 border-yellow-400/20 bg-gradient-to-r from-yellow-400/5 to-transparent p-6 transition-all hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="rounded-full bg-yellow-400/20 p-3">
                  <ExternalLink className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Toma Thiên
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bài học tiếng Việt trực tuyến cho tất cả các lớp
                  </p>
                </div>
              </a>
              <a
                href="https://www.vietcatholic.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border-2 border-yellow-400/20 bg-gradient-to-r from-yellow-400/5 to-transparent p-6 transition-all hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="rounded-full bg-yellow-400/20 p-3">
                  <ExternalLink className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    VietCatholic
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tin tức và tài liệu Công Giáo Việt Nam
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vietnamese Class Materials */}
      {vietnameseGrades.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-slate-900">
              Lớp Việt Ngữ
            </h2>
            <div className="mx-auto max-w-5xl space-y-8">
              {vietnameseGrades.map((grade) => (
                <div
                  key={grade}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="border-b border-gray-200 bg-slate-900 px-6 py-4">
                    <h3 className="font-serif text-xl font-bold text-white">
                      {gradeLevelLabels[grade]}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {materialsByGrade[grade].map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-yellow-400/10 p-2">
                            <FileText className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {material.title}
                            </h4>
                            {material.lessonNumbers && (
                              <p className="text-sm text-gray-500">
                                Bài: {material.lessonNumbers}
                              </p>
                            )}
                            {material.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {material.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {material.externalLink && (
                            <a
                              href={material.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900/90"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Xem
                            </a>
                          )}
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              download
                              className="flex items-center gap-1 rounded-lg border border-yellow-400 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-yellow-400/20"
                            >
                              <Download className="h-4 w-4" />
                              Tải về
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TNTT Materials */}
      {tnttGrades.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-slate-900">
              Tài Liệu TNTT
            </h2>
            <div className="mx-auto max-w-5xl space-y-8">
              {tnttGrades.map((grade) => (
                <div
                  key={grade}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-400/80 px-6 py-4">
                    <h3 className="font-serif text-xl font-bold text-slate-900">
                      {gradeLevelLabels[grade]}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {materialsByGrade[grade].map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-slate-900/10 p-2">
                            <FileText className="h-5 w-5 text-slate-900" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {material.title}
                            </h4>
                            {material.lessonNumbers && (
                              <p className="text-sm text-gray-500">
                                Bài: {material.lessonNumbers}
                              </p>
                            )}
                            {material.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {material.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {material.externalLink && (
                            <a
                              href={material.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900/90"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Xem
                            </a>
                          )}
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              download
                              className="flex items-center gap-1 rounded-lg border border-yellow-400 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-yellow-400/20"
                            >
                              <Download className="h-4 w-4" />
                              Tải về
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {materials.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-gray-600">
              Chưa có tài liệu
            </h2>
            <p className="mt-2 text-gray-500">
              Tài liệu học tập sẽ được cập nhật sớm.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-yellow-400/90"
            >
              Về trang chủ
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
