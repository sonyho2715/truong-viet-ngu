'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  trigger: React.ReactNode;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  trigger,
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = useCallback(async () => {
    setIsPending(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsPending(false);
    }
  }, [onConfirm]);

  const handleClose = useCallback(() => {
    if (!isLoading && !isPending) {
      setIsOpen(false);
    }
  }, [isLoading, isPending]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Focus the cancel button when dialog opens
    cancelButtonRef.current?.focus();

    // Get all focusable elements
    const getFocusableElements = () => {
      return dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Focus trap on Tab
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    // Prevent scroll on body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Return focus to trigger element
      triggerRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  const variantStyles = {
    danger: {
      icon: 'bg-error/10 text-error',
      button: 'bg-error hover:bg-error-dark focus-visible:ring-error',
    },
    warning: {
      icon: 'bg-warning/10 text-warning-dark',
      button: 'bg-warning hover:bg-warning-dark focus-visible:ring-warning',
    },
  };

  const styles = variantStyles[variant];
  const loading = isLoading || isPending;

  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        role="button"
        aria-haspopup="dialog"
      >
        {trigger}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="relative z-50 w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50"
              aria-label="Đóng hộp thoại"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${styles.icon}`} aria-hidden="true">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <h3 id="dialog-title" className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p id="dialog-description" className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 ${styles.button}`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
