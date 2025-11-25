'use client';

import { DeleteButton } from '@/components/ui/DeleteButton';
import { deleteTeacherAction } from '@/app/admin/(dashboard)/dashboard/teachers/actions';

interface DeleteTeacherButtonProps {
  teacherId: string;
  teacherName?: string;
}

export function DeleteTeacherButton({ teacherId, teacherName }: DeleteTeacherButtonProps) {
  return (
    <DeleteButton
      itemName={teacherName || 'Giáo viên'}
      itemType="giáo viên"
      onDelete={() => deleteTeacherAction(teacherId)}
    />
  );
}
