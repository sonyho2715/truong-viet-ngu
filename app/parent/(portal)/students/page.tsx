import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import { Users, GraduationCap, Calendar, BookOpen, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Học sinh | Cổng Phụ Huynh',
};

const gradeLevelLabels: Record<string, string> = {
  PRE_K: 'Mầm non',
  KINDERGARTEN: 'Mẫu giáo',
  GRADE_1: 'Lớp 1',
  GRADE_2: 'Lớp 2',
  GRADE_3: 'Lớp 3',
  GRADE_4: 'Lớp 4',
  GRADE_5: 'Lớp 5',
  GRADE_6: 'Lớp 6',
  GRADE_7: 'Lớp 7',
  GRADE_8: 'Lớp 8',
  GRADE_9: 'Lớp 9',
  GRADE_10: 'Lớp 10',
  GRADE_11: 'Lớp 11',
  GRADE_12: 'Lớp 12',
  ADULT: 'Người lớn',
};

export default async function ParentStudentsPage() {
  const parent = await getCurrentParent();

  if (!parent) {
    redirect('/parent/login');
  }

  const students = await db.student.findMany({
    where: { parentId: parent.parentId },
    include: {
      enrollments: {
        where: { status: 'ACTIVE' },
        include: {
          class: {
            include: {
              teacher: true,
            },
          },
        },
      },
      attendance: {
        orderBy: { date: 'desc' },
        take: 10,
      },
      grades: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Học sinh của bạn</h1>
        <p className="mt-2 text-gray-600">
          Quản lý thông tin và theo dõi tiến trình học tập của con em
        </p>
      </div>

      {students.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có học sinh nào được liên kết
          </h3>
          <p className="mt-2 text-gray-600">
            Vui lòng liên hệ nhà trường để liên kết hồ sơ học sinh với tài khoản của bạn.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {students.map((student) => {
            const attendanceStats = {
              present: student.attendance.filter(a => a.status === 'PRESENT').length,
              absent: student.attendance.filter(a => a.status === 'ABSENT').length,
              late: student.attendance.filter(a => a.status === 'LATE').length,
            };

            const currentClass = student.enrollments[0]?.class;

            return (
              <div
                key={student.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream">
                      <GraduationCap className="h-7 w-7 text-brand-navy" />
                    </div>
                    <div className="text-white">
                      <h3 className="font-serif text-xl font-bold">
                        {student.lastName} {student.firstName}
                      </h3>
                      <p className="text-brand-cream">
                        {student.gradeLevel ? gradeLevelLabels[student.gradeLevel] : 'Chưa xếp lớp'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Class Info */}
                  {currentClass && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm font-medium text-gray-500">Lớp hiện tại</p>
                      <p className="font-medium text-gray-900">{currentClass.name}</p>
                      {currentClass.teacher && (
                        <p className="text-sm text-gray-600">
                          GV: {currentClass.teacher.lastName} {currentClass.teacher.firstName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Attendance Summary */}
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg bg-green-50 p-2 text-center">
                      <p className="text-lg font-bold text-green-700">{attendanceStats.present}</p>
                      <p className="text-xs text-green-600">Có mặt</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-red-50 p-2 text-center">
                      <p className="text-lg font-bold text-red-700">{attendanceStats.absent}</p>
                      <p className="text-xs text-red-600">Vắng</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-yellow-50 p-2 text-center">
                      <p className="text-lg font-bold text-yellow-700">{attendanceStats.late}</p>
                      <p className="text-xs text-yellow-600">Trễ</p>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="flex gap-2">
                    <Link
                      href={`/parent/attendance?student=${student.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Calendar className="h-4 w-4" />
                      Điểm danh
                    </Link>
                    <Link
                      href={`/parent/grades?student=${student.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <BookOpen className="h-4 w-4" />
                      Điểm số
                    </Link>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/parent/students/${student.id}`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-2.5 font-semibold text-brand-navy hover:bg-brand-gold/90"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
