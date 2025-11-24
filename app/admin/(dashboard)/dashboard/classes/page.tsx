import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';

export const metadata = {
  title: 'Quản lý lớp học | Trang quản trị',
};

const gradeLevelLabels: Record<string, string> = {
  MAU_GIAO_A: 'Mẫu Giáo A',
  MAU_GIAO_B: 'Mẫu Giáo B',
  MAU_GIAO_C: 'Mẫu Giáo C',
  LOP_1: 'Lớp 1',
  LOP_2: 'Lớp 2',
  LOP_3: 'Lớp 3',
  LOP_4: 'Lớp 4',
  LOP_5: 'Lớp 5',
  LOP_6: 'Lớp 6',
  LOP_7: 'Lớp 7',
  AU_NHI: 'Ấu Nhi',
  THIEU_NHI: 'Thiếu Nhi',
  NGHIA_SI: 'Nghĩa Sĩ',
  HIEP_SI: 'Hiệp Sĩ',
};

export default async function ClassesPage() {
  const classes = await db.class.findMany({
    orderBy: [{ displayOrder: 'asc' }],
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="mt-2 text-gray-600">
            Tạo và quản lý các lớp Việt Ngữ và TNTT
          </p>
        </div>
        <Link
          href="/admin/dashboard/classes/new"
          className="flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm lớp học
        </Link>
      </div>

      {/* Classes List */}
      {classes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có lớp học nào
          </h3>
          <p className="mt-2 text-gray-600">Bắt đầu bằng cách tạo lớp học đầu tiên.</p>
          <Link
            href="/admin/dashboard/classes/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy transition-all hover:bg-brand-gold/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tạo lớp học
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Link
              key={classItem.id}
              href={`/admin/dashboard/classes/${classItem.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-gold hover:shadow-lg"
            >
              {/* Class Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy/80">
                {classItem.classroomImage ? (
                  <Image
                    src={classItem.classroomImage}
                    alt={`${classItem.name} classroom`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-4xl font-bold text-brand-gold opacity-30">
                      {gradeLevelLabels[classItem.gradeLevel]}
                    </span>
                  </div>
                )}
                {/* Active Status Badge */}
                <div className="absolute right-2 top-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      classItem.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    {classItem.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>

              {/* Class Info */}
              <div className="p-4">
                <h3 className="mb-2 font-serif text-xl font-bold text-brand-navy">
                  {classItem.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {classItem.teacherName && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="truncate">{classItem.teacherName}</span>
                    </div>
                  )}
                  {classItem.schedule && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="truncate">{classItem.schedule}</span>
                    </div>
                  )}
                  {classItem.roomNumber && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-brand-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span>Phòng {classItem.roomNumber}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-brand-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Chỉnh sửa
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
