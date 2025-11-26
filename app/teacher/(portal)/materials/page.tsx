import Link from 'next/link';
import { FileText, Download, ExternalLink, Folder } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

export default async function TeacherMaterialsPage() {
  await requireTeacherAuth();

  // Get all learning materials
  const materials = await db.learningMaterial.findMany({
    where: { isActive: true },
    orderBy: [{ gradeLevel: 'asc' }, { displayOrder: 'asc' }],
  });

  // Group by grade level
  const materialsByGrade = materials.reduce(
    (acc, material) => {
      const grade = material.gradeLevel || 'Khác';
      if (!acc[grade]) {
        acc[grade] = [];
      }
      acc[grade].push(material);
      return acc;
    },
    {} as Record<string, typeof materials>
  );

  const grades = Object.keys(materialsByGrade);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tài Liệu Giảng Dạy</h1>
        <p className="mt-1 text-sm text-gray-600">
          Truy cập tài liệu học tập và giáo trình
        </p>
      </div>

      {grades.length > 0 ? (
        <div className="space-y-6">
          {grades.map((grade) => (
            <div key={grade} className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                <div className="rounded-lg bg-brand-gold/20 p-2">
                  <Folder className="h-5 w-5 text-brand-navy" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{grade}</h2>
                  <p className="text-sm text-gray-500">
                    {materialsByGrade[grade].length} tài liệu
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {materialsByGrade[grade].map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {material.title}
                        </h3>
                        {material.description && (
                          <p className="text-sm text-gray-500">
                            {material.description}
                          </p>
                        )}
                        {material.lessonNumbers && (
                          <span className="mt-1 inline-block text-xs text-gray-400">
                            Bài: {material.lessonNumbers}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {material.fileUrl && (
                        <a
                          href={material.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-brand-navy px-3 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
                        >
                          <Download className="h-4 w-4" />
                          Tải xuống
                        </a>
                      )}
                      {material.externalLink && (
                        <a
                          href={material.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Mở link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <FileText className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-600">
            Chưa có tài liệu
          </h2>
          <p className="mt-2 text-gray-500">
            Tài liệu giảng dạy sẽ được cập nhật sớm.
          </p>
        </div>
      )}

      {/* Public Materials Link */}
      <div className="rounded-xl bg-brand-navy/5 p-6 text-center">
        <p className="text-gray-600">
          Xem thêm tài liệu học tập trên trang công khai
        </p>
        <Link
          href="/materials"
          className="mt-3 inline-block rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white hover:bg-brand-navy/90"
        >
          Xem tài liệu học tập
        </Link>
      </div>
    </div>
  );
}
