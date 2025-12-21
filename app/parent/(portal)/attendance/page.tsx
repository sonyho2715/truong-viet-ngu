import { redirect } from 'next/navigation';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Điểm danh | Cổng Phụ Huynh',
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; Icon: React.ElementType }> = {
  PRESENT: { label: 'Có mặt', color: 'text-green-800', bgColor: 'bg-green-100', Icon: CheckCircle2 },
  ABSENT: { label: 'Vắng', color: 'text-red-800', bgColor: 'bg-red-100', Icon: XCircle },
  LATE: { label: 'Đi trễ', color: 'text-yellow-800', bgColor: 'bg-yellow-100', Icon: Clock },
  EXCUSED: { label: 'Có phép', color: 'text-blue-800', bgColor: 'bg-blue-100', Icon: AlertCircle },
};

interface PageProps {
  searchParams: Promise<{ student?: string }>;
}

export default async function ParentAttendancePage({ searchParams }: PageProps) {
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
      attendance: {
        include: {
          class: true,
        },
        orderBy: { date: 'desc' },
        take: 50,
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

  // Calculate overall stats
  const allAttendance = filteredStudents.flatMap(s => s.attendance);
  const stats = {
    total: allAttendance.length,
    present: allAttendance.filter(a => a.status === 'PRESENT').length,
    absent: allAttendance.filter(a => a.status === 'ABSENT').length,
    late: allAttendance.filter(a => a.status === 'LATE').length,
    excused: allAttendance.filter(a => a.status === 'EXCUSED').length,
  };
  const attendanceRate = stats.total > 0
    ? Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Điểm danh</h1>
        <p className="mt-2 text-gray-600">
          Theo dõi lịch sử điểm danh của con em
        </p>
      </div>

      {/* Student Filter */}
      {students.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <a
            href="/parent/attendance"
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
              href={`/parent/attendance?student=${student.id}`}
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-sm text-gray-600">Tỷ lệ chuyên cần</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              <p className="text-sm text-gray-600">Có mặt</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              <p className="text-sm text-gray-600">Vắng không phép</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              <p className="text-sm text-gray-600">Đi trễ</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.excused}</p>
              <p className="text-sm text-gray-600">Có phép</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      {filteredStudents.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có dữ liệu điểm danh
          </h3>
          <p className="mt-2 text-gray-600">
            Dữ liệu điểm danh sẽ xuất hiện khi giáo viên cập nhật
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

              {student.attendance.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Chưa có dữ liệu điểm danh
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {student.attendance.map((record) => {
                    const status = statusConfig[record.status];
                    const StatusIcon = status.Icon;
                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-1.5 ${status.bgColor}`}>
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(record.date).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            {record.class && (
                              <p className="text-sm text-gray-500">{record.class.name}</p>
                            )}
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
