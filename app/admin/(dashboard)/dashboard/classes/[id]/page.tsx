import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ClassForm } from '@/components/admin/ClassForm';
import { DeleteClassButton } from '@/components/admin/DeleteClassButton';
import { EnrollmentManager } from '@/components/admin/EnrollmentManager';

export const metadata = {
  title: 'Chỉnh sửa lớp học | Trang quản trị',
};

interface EditClassPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const { id } = await params;

  const classData = await db.class.findUnique({
    where: { id },
  });

  if (!classData) {
    notFound();
  }

  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  // Fetch current enrollments for this class
  const enrollments = await db.enrollment.findMany({
    where: { classId: id },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { student: { lastName: 'asc' } },
      { student: { firstName: 'asc' } },
    ],
  });

  // Get IDs of already enrolled students
  const enrolledStudentIds = enrollments.map((e) => e.studentId);

  // Fetch available students (active students not already enrolled in this class)
  const availableStudents = await db.student.findMany({
    where: {
      isActive: true,
      id: {
        notIn: enrolledStudentIds,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Chỉnh sửa lớp học
          </h1>
          <p className="mt-2 text-gray-600">Cập nhật thông tin lớp học</p>
        </div>
        <DeleteClassButton classId={classData.id} className={classData.name} />
      </div>

      {/* Class Information Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <ClassForm mode="edit" initialData={classData} teachers={teachers} />
      </div>

      {/* Student Enrollment Manager */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <EnrollmentManager
          classId={id}
          enrollments={enrollments}
          availableStudents={availableStudents}
        />
      </div>
    </div>
  );
}
