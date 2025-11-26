import Link from 'next/link';
import { Users, BookOpen, User, Phone, Mail } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

export default async function TeacherStudentsPage() {
  const session = await requireTeacherAuth();

  // Get all classes with enrollments for this teacher
  const classes = await db.class.findMany({
    where: {
      teacherId: session.teacherId,
      isActive: true,
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
    orderBy: { name: 'asc' },
  });

  const totalStudents = classes.reduce(
    (acc, cls) => acc + cls.enrollments.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Học Sinh Của Tôi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tổng cộng {totalStudents} học sinh trong {classes.length} lớp
          </p>
        </div>
      </div>

      {classes.length > 0 ? (
        <div className="space-y-6">
          {classes.map((cls) => (
            <div key={cls.id} className="rounded-xl bg-white shadow-sm">
              {/* Class Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-brand-gold/20 p-2">
                    <BookOpen className="h-5 w-5 text-brand-navy" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{cls.name}</h2>
                    <p className="text-sm text-gray-500">
                      {cls.enrollments.length} học sinh
                    </p>
                  </div>
                </div>
                <Link
                  href={`/teacher/classes/${cls.id}`}
                  className="text-sm text-brand-navy hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>

              {/* Students */}
              {cls.enrollments.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {cls.enrollments.map((enrollment) => {
                    const student = enrollment.student;
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {student.lastName} {student.firstName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {student.dateOfBirth
                                ? new Date(student.dateOfBirth).toLocaleDateString(
                                    'vi-VN'
                                  )
                                : 'Chưa có ngày sinh'}
                            </p>
                          </div>
                        </div>

                        {/* Parent Contact */}
                        {student.parentName && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="hidden items-center gap-1 text-gray-600 sm:flex">
                              <User className="h-4 w-4" />
                              <span>{student.parentName}</span>
                            </div>
                            {student.parentPhone && (
                              <a
                                href={`tel:${student.parentPhone}`}
                                className="flex items-center gap-1 text-brand-navy hover:underline"
                              >
                                <Phone className="h-4 w-4" />
                                <span className="hidden md:inline">
                                  {student.parentPhone}
                                </span>
                              </a>
                            )}
                            {student.parentEmail && (
                              <a
                                href={`mailto:${student.parentEmail}`}
                                className="flex items-center gap-1 text-brand-navy hover:underline"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    Lớp chưa có học sinh nào
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <Users className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-600">
            Chưa có học sinh nào
          </h2>
          <p className="mt-2 text-gray-500">
            Bạn chưa được phân công lớp học nào.
          </p>
        </div>
      )}
    </div>
  );
}
