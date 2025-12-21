import { redirect } from 'next/navigation';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import { BookOpen, TrendingUp, Star, Award } from 'lucide-react';

export const metadata = {
  title: 'Điểm số | Cổng Phụ Huynh',
};

interface PageProps {
  searchParams: Promise<{ student?: string }>;
}

export default async function ParentGradesPage({ searchParams }: PageProps) {
  const parent = await getCurrentParent();

  if (!parent) {
    redirect('/parent/login');
  }

  const params = await searchParams;
  const studentFilter = params.student || '';

  // Get all students for this parent
  const students = await db.student.findMany({
    where: { parentId: parent.parentId },
    include: {
      grades: {
        include: {
          class: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      enrollments: {
        where: { status: 'ACTIVE' },
        include: { class: true },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  // Filter if a specific student is selected
  const filteredStudents = studentFilter
    ? students.filter(s => s.id === studentFilter)
    : students;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Điểm số</h1>
        <p className="mt-2 text-gray-600">
          Xem kết quả học tập của con em
        </p>
      </div>

      {/* Student Filter */}
      {students.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <a
            href="/parent/grades"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !studentFilter
                ? 'bg-brand-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </a>
          {students.map((student) => (
            <a
              key={student.id}
              href={`/parent/grades?student=${student.id}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                studentFilter === student.id
                  ? 'bg-brand-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {student.firstName}
            </a>
          ))}
        </div>
      )}

      {/* Grades List */}
      {filteredStudents.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có dữ liệu điểm số
          </h3>
          <p className="mt-2 text-gray-600">
            Dữ liệu điểm số sẽ xuất hiện khi giáo viên cập nhật
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStudents.map((student) => {
            // Calculate average grade
            const gradesWithScore = student.grades.filter(g => g.score !== null);
            const avgScore = gradesWithScore.length > 0
              ? gradesWithScore.reduce((sum, g) => sum + (g.score || 0), 0) / gradesWithScore.length
              : 0;

            // Group grades by category
            const gradesByCategory = student.grades.reduce((acc, grade) => {
              const category = grade.category || 'OTHER';
              if (!acc[category]) acc[category] = [];
              acc[category].push(grade);
              return acc;
            }, {} as Record<string, typeof student.grades>);

            return (
              <div key={student.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {/* Student Header */}
                <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="font-serif text-xl font-bold">
                        {student.lastName} {student.firstName}
                      </h3>
                      {student.enrollments[0]?.class && (
                        <p className="text-brand-cream">
                          {student.enrollments[0].class.name}
                        </p>
                      )}
                    </div>
                    {gradesWithScore.length > 0 && (
                      <div className="text-right text-white">
                        <p className="text-sm text-brand-cream">Điểm trung bình</p>
                        <p className="text-3xl font-bold">{avgScore.toFixed(1)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {student.grades.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Chưa có điểm số nào
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-blue-50 p-3 text-center">
                        <BookOpen className="mx-auto h-5 w-5 text-blue-600" />
                        <p className="mt-1 text-lg font-bold text-blue-900">{student.grades.length}</p>
                        <p className="text-xs text-blue-700">Tổng bài</p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3 text-center">
                        <TrendingUp className="mx-auto h-5 w-5 text-green-600" />
                        <p className="mt-1 text-lg font-bold text-green-900">
                          {gradesWithScore.length > 0
                            ? Math.max(...gradesWithScore.map(g => g.score || 0)).toFixed(1)
                            : '-'}
                        </p>
                        <p className="text-xs text-green-700">Điểm cao nhất</p>
                      </div>
                      <div className="rounded-lg bg-yellow-50 p-3 text-center">
                        <Star className="mx-auto h-5 w-5 text-yellow-600" />
                        <p className="mt-1 text-lg font-bold text-yellow-900">
                          {gradesWithScore.filter(g => (g.score || 0) >= 8).length}
                        </p>
                        <p className="text-xs text-yellow-700">Điểm giỏi</p>
                      </div>
                    </div>

                    {/* Recent Grades */}
                    <div>
                      <h4 className="mb-3 font-semibold text-gray-900">Điểm gần đây</h4>
                      <div className="space-y-2">
                        {student.grades.slice(0, 10).map((grade) => (
                          <div
                            key={grade.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{grade.name}</p>
                              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                {grade.class && <span>{grade.class.name}</span>}
                                <span>-</span>
                                <span>
                                  {new Date(grade.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              {grade.score !== null ? (
                                <span className={`text-xl font-bold ${
                                  grade.score >= 8 ? 'text-green-600' :
                                  grade.score >= 6.5 ? 'text-blue-600' :
                                  grade.score >= 5 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {grade.score.toFixed(1)}
                                </span>
                              ) : grade.letterGrade ? (
                                <span className="text-xl font-bold text-brand-navy">
                                  {grade.letterGrade}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                              {grade.maxScore && grade.score !== null && (
                                <span className="text-sm text-gray-500">/{grade.maxScore}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
