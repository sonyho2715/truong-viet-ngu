'use client';

import { DeleteButton } from '@/components/ui/DeleteButton';
import { deleteMaterialAction } from '@/app/admin/(dashboard)/dashboard/materials/actions';

interface DeleteMaterialButtonProps {
  materialId: string;
  materialTitle?: string;
}

export function DeleteMaterialButton({ materialId, materialTitle }: DeleteMaterialButtonProps) {
  return (
    <DeleteButton
      itemName={materialTitle || 'Tài liệu'}
      itemType="tài liệu"
      onDelete={() => deleteMaterialAction(materialId)}
    />
  );
}
