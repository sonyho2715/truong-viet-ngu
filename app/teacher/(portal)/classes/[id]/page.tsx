import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Users, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeacherClassDetailPage({ params }: Props) {
  const session = await requireTeacherAuth();
  const { id } = await params;

  const classData = await db.class.findFirst({
    where: {
      id,
      teacherId: session.teacherId,
    },
    include: {
      enrollments: {
        where: { status: 'ACTIVE' },
        include: {
          student: true,
        },
        orderBy: {
          student: { lastName: 'asc' },
        },
      },
    },
  });

  if (!classData) {
    notFound();
  }

  const students = classData.enrollments.map((e) => e.student);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/teacher/classes"
          className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-sm text-gray-600">{classData.gradeLevel}</p>
        </div>
      </div>

      {/* Class Info */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Thông tin lớp học</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sĩ số</p>
              <p className="font-semibold text-gray-900">
                {students.length} học sinh
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cấp độ</p>
              <p className="font-semibold text-gray-900">{classData.gradeLevel}</p>
            </div>
          </div>
          {classData.roomNumber && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phòng học</p>
                <p className="font-semibold text-gray-900">
                  Phòng {classData.roomNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        {classData.description && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">{classData.description}</p>
          </div>
        )}
      </div>

      {/* Students List */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Danh sách học sinh</h2>
        </div>

        {students.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {students.map((student, index) => (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student.lastName} {student.firstName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ngày sinh:{' '}
                        {student.dateOfBirth
                          ? new Date(student.dateOfBirth).toLocaleDateString(
                              'vi-VN'
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Parent Info */}
                  {student.parentName && (
                    <div className="text-right text-sm">
                      <div className="flex items-center justify-end gap-1 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{student.parentName}</span>
                      </div>
                      {student.parentPhone && (
                        <a
                          href={`tel:${student.parentPhone}`}
                          className="mt-1 flex items-center justify-end gap-1 text-brand-navy hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          {student.parentPhone}
                        </a>
                      )}
                      {student.parentEmail && (
                        <a
                          href={`mailto:${student.parentEmail}`}
                          className="mt-1 flex items-center justify-end gap-1 text-brand-navy hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          {student.parentEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {student.notes && (
                  <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-sm text-yellow-800">
                    Ghi chú: {student.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Lớp chưa có học sinh nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
