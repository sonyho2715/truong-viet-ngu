'use client';

import { DeleteButton } from '@/components/ui/DeleteButton';
import { deleteAnnouncementAction } from '@/app/admin/(dashboard)/dashboard/announcements/actions';

interface DeleteAnnouncementButtonProps {
  id: string;
  title: string;
}

export function DeleteAnnouncementButton({ id, title }: DeleteAnnouncementButtonProps) {
  return (
    <DeleteButton
      itemName={title}
      itemType="thông báo"
      onDelete={() => deleteAnnouncementAction(id)}
    />
  );
}
