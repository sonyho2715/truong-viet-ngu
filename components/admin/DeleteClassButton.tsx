'use client';

import { useTransition, useState } from 'react';
import { deleteClassAction } from '@/app/admin/(dashboard)/dashboard/classes/actions';

interface DeleteClassButtonProps {
  classId: string;
  className?: string;
}

export function DeleteClassButton({ classId, className }: DeleteClassButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      await deleteClassAction(classId);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={`rounded-lg border p-2 transition-colors disabled:opacity-50 ${
          showConfirm
            ? 'border-red-600 bg-red-50 text-red-600'
            : 'border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600'
        }`}
        title={showConfirm ? 'Nhấn lần nữa để xác nhận xóa' : 'Xóa lớp học'}
      >
        {isPending ? (
          <svg
            className="h-5 w-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>

      {showConfirm && !isPending && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowConfirm(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-red-200 bg-white p-4 shadow-xl">
            <p className="text-sm font-medium text-gray-900">Xóa lớp học?</p>
            <p className="mt-1 text-xs text-gray-600">
              Bạn có chắc muốn xóa lớp học này? <strong>{className || 'Lớp học'}</strong> sẽ bị xóa vĩnh viễn.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
