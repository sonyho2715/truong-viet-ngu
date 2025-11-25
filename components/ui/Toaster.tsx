'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'font-sans border-2',
          title: 'font-semibold',
          description: 'text-sm',
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-amber-50 border-amber-200 text-amber-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800',
        },
      }}
      richColors
      closeButton
    />
  );
}
