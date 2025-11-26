import Link from 'next/link';
import { BookOpen, Users, Clock, MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { requireTeacherAuth } from '@/lib/teacher-auth';

export default async function TeacherClassesPage() {
  const session = await requireTeacherAuth();

  const classes = await db.class.findMany({
    where: {
      teacherId: session.teacherId,
      isActive: true,
    },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lớp Của Tôi</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý các lớp học bạn đang phụ trách
        </p>
      </div>

      {classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/teacher/classes/${cls.id}`}
              className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-gold/20 p-3">
                  <BookOpen className="h-6 w-6 text-brand-navy" />
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Đang hoạt động
                </span>
              </div>

              <h3 className="mt-4 font-serif text-lg font-bold text-gray-900 group-hover:text-brand-navy">
                {cls.name}
              </h3>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{cls._count.enrollments} học sinh</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{cls.gradeLevel}</span>
                </div>
                {cls.roomNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Phòng {cls.roomNumber}</span>
                  </div>
                )}
              </div>

              {cls.description && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {cls.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 font-serif text-xl font-bold text-gray-600">
            Chưa có lớp nào
          </h2>
          <p className="mt-2 text-gray-500">
            Bạn chưa được phân công lớp học nào. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      )}
    </div>
  );
}
