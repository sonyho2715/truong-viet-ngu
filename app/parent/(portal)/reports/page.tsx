import { redirect } from 'next/navigation';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import { FileText, Download, Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Phiếu liên lạc | Cổng Phụ Huynh',
};

interface PageProps {
  searchParams: Promise<{ student?: string }>;
}

export default async function ParentReportsPage({ searchParams }: PageProps) {
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
      reportCards: {
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
        <h1 className="font-serif text-3xl font-bold text-gray-900">Phiếu liên lạc</h1>
        <p className="mt-2 text-gray-600">
          Xem báo cáo tổng hợp và đánh giá của con em
        </p>
      </div>

      {/* Student Filter */}
      {students.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <a
            href="/parent/reports"
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
              href={`/parent/reports?student=${student.id}`}
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

      {/* Reports List */}
      {filteredStudents.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có phiếu liên lạc
          </h3>
          <p className="mt-2 text-gray-600">
            Phiếu liên lạc sẽ xuất hiện khi giáo viên cập nhật
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="font-semibold text-gray-900">
                  {student.lastName} {student.firstName}
                  {student.enrollments[0]?.class && (
                    <span className="ml-2 font-normal text-gray-500">
                      - {student.enrollments[0].class.name}
                    </span>
                  )}
                </h3>
              </div>

              {student.reportCards.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Chưa có phiếu liên lạc nào
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {student.reportCards.map((report) => (
                    <div key={report.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-brand-gold" />
                            <h4 className="font-semibold text-gray-900">
                              {report.semester} - {report.academicYear}
                            </h4>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                            {report.class && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {report.class.name}
                              </div>
                            )}
                          </div>

                          {/* Overall Grade */}
                          {report.overallGrade && (
                            <div className="mt-3">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                report.overallGrade === 'A' || report.overallGrade === 'Giỏi'
                                  ? 'bg-green-100 text-green-800'
                                  : report.overallGrade === 'B' || report.overallGrade === 'Khá'
                                  ? 'bg-blue-100 text-blue-800'
                                  : report.overallGrade === 'C' || report.overallGrade === 'Trung bình'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                Xếp loại: {report.overallGrade}
                              </span>
                            </div>
                          )}

                          {/* Comments */}
                          {report.teacherComments && (
                            <div className="mt-3 rounded-lg bg-gray-50 p-3">
                              <p className="text-sm font-medium text-gray-700">Nhận xét của giáo viên:</p>
                              <p className="mt-1 text-sm text-gray-600">{report.teacherComments}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
