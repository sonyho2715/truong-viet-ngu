'use client';

import { useState, useTransition } from 'react';
import { Student, Enrollment, EnrollmentStatus } from '@prisma/client';
import {
  enrollStudentAction,
  updateEnrollmentStatusAction,
  removeEnrollmentAction,
} from '@/app/admin/(dashboard)/dashboard/classes/enrollment-actions';

interface EnrollmentManagerProps {
  classId: string;
  enrollments: (Enrollment & {
    student: Pick<Student, 'id' | 'firstName' | 'lastName' | 'photoUrl'>;
  })[];
  availableStudents: Pick<Student, 'id' | 'firstName' | 'lastName'>[];
}

const statusLabels: Record<EnrollmentStatus, string> = {
  ACTIVE: 'Đang học',
  INACTIVE: 'Tạm nghỉ',
  COMPLETED: 'Hoàn thành',
  DROPPED: 'Đã bỏ',
};

const statusColors: Record<EnrollmentStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DROPPED: 'bg-gray-100 text-gray-800',
};

export function EnrollmentManager({
  classId,
  enrollments,
  availableStudents,
}: EnrollmentManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleEnroll() {
    if (!selectedStudent) {
      setError('Vui lòng chọn học sinh');
      return;
    }

    const formData = new FormData();
    formData.append('studentId', selectedStudent);
    formData.append('classId', classId);
    formData.append('status', 'ACTIVE');

    setError(null);
    startTransition(async () => {
      const result = await enrollStudentAction(formData);
      if (result.success) {
        setShowAddForm(false);
        setSelectedStudent('');
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    });
  }

  function handleStatusChange(enrollmentId: string, status: EnrollmentStatus) {
    startTransition(async () => {
      await updateEnrollmentStatusAction(enrollmentId, status);
    });
  }

  function handleRemove(enrollmentId: string) {
    if (!confirm('Bạn có chắc muốn xóa học sinh này khỏi lớp?')) {
      return;
    }

    startTransition(async () => {
      await removeEnrollmentAction(enrollmentId);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-900">
            Danh sách học sinh ({enrollments.length})
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý học sinh ghi danh vào lớp này
          </p>
        </div>
        {availableStudents.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-gold/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm học sinh
          </button>
        )}
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="rounded-lg border-2 border-brand-gold bg-brand-cream p-4">
          <h4 className="mb-3 font-semibold text-brand-navy">Ghi danh học sinh mới</h4>
          {error && (
            <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={isPending}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50"
            >
              <option value="">Chọn học sinh...</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleEnroll}
              disabled={isPending || !selectedStudent}
              className="rounded-lg bg-brand-gold px-6 py-2 font-semibold text-brand-navy transition-all hover:bg-brand-gold/90 disabled:opacity-50"
            >
              {isPending ? 'Đang thêm...' : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedStudent('');
                setError(null);
              }}
              disabled={isPending}
              className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Enrolled Students List */}
      {enrollments.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mt-3 text-sm text-gray-600">
            Chưa có học sinh nào ghi danh vào lớp này
          </p>
          {availableStudents.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-gold/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm học sinh đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-brand-gold"
            >
              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-navy/10">
                  {enrollment.student.photoUrl ? (
                    <img
                      src={enrollment.student.photoUrl}
                      alt={`${enrollment.student.firstName} ${enrollment.student.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-6 w-6 text-brand-gold"
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
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {enrollment.student.firstName} {enrollment.student.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ghi danh: {new Date(enrollment.enrollmentDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <select
                  value={enrollment.status}
                  onChange={(e) =>
                    handleStatusChange(enrollment.id, e.target.value as EnrollmentStatus)
                  }
                  disabled={isPending}
                  className={`rounded-lg border-0 px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50 ${
                    statusColors[enrollment.status]
                  }`}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemove(enrollment.id)}
                  disabled={isPending}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Xóa khỏi lớp"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
