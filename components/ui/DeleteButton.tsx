'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

interface DeleteButtonProps {
  itemName: string;
  itemType: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  size?: 'sm' | 'md';
}

export function DeleteButton({
  itemName,
  itemType,
  onDelete,
  size = 'md',
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await onDelete();
      if (result.success) {
        toast.success(`Đã xóa ${itemType} thành công`);
      } else {
        toast.error(result.error || `Không thể xóa ${itemType}`);
      }
    });
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
  };

  const iconClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  return (
    <ConfirmDialog
      title={`Xóa ${itemType}?`}
      message={`Bạn có chắc muốn xóa "${itemName}"? Hành động này không thể hoàn tác.`}
      confirmText="Xóa"
      cancelText="Hủy"
      onConfirm={handleDelete}
      variant="danger"
      isLoading={isPending}
      trigger={
        <button
          type="button"
          disabled={isPending}
          className={`rounded-lg border border-gray-300 text-gray-600 transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 ${sizeClasses[size]}`}
          title={`Xóa ${itemType}`}
        >
          {isPending ? (
            <Loader2 className={`animate-spin ${iconClasses[size]}`} />
          ) : (
            <Trash2 className={iconClasses[size]} />
          )}
        </button>
      }
    />
  );
}
