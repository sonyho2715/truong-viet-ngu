'use client';

import { DeleteButton } from '@/components/ui/DeleteButton';
import { deleteClassAction } from '@/app/admin/(dashboard)/dashboard/classes/actions';

interface DeleteClassButtonProps {
  classId: string;
  className?: string;
}

export function DeleteClassButton({ classId, className }: DeleteClassButtonProps) {
  return (
    <DeleteButton
      itemName={className || 'Lớp học'}
      itemType="lớp học"
      onDelete={() => deleteClassAction(classId)}
    />
  );
}
