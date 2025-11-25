'use client';

import { DeleteButton } from '@/components/ui/DeleteButton';
import { deleteStudentAction } from '@/app/admin/(dashboard)/dashboard/students/actions';

interface DeleteStudentButtonProps {
  studentId: string;
  studentName?: string;
}

export function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps) {
  return (
    <DeleteButton
      itemName={studentName || 'Học sinh'}
      itemType="học sinh"
      onDelete={() => deleteStudentAction(studentId)}
    />
  );
}
