import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { StudentForm } from '@/components/admin/StudentForm';
import { DeleteStudentButton } from '@/components/admin/DeleteStudentButton';

export const metadata = {
  title: 'Chỉnh sửa học sinh | Trang quản trị',
};

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  const student = await db.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Chỉnh sửa học sinh
          </h1>
          <p className="mt-2 text-gray-600">
            Cập nhật thông tin cho {student.firstName} {student.lastName}
          </p>
          {student.enrollments.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Đang học {student.enrollments.length} lớp:
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {student.enrollments.map((enrollment) => (
                  <span
                    key={enrollment.id}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {enrollment.class.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <DeleteStudentButton
          studentId={student.id}
          studentName={`${student.firstName} ${student.lastName}`}
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <StudentForm mode="edit" initialData={student} />
      </div>
    </div>
  );
}
