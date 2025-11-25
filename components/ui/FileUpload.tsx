'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  category: 'materials';
  label?: string;
  helpText?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  category,
  label,
  helpText,
  accept = '.pdf,application/pdf',
  maxSizeMB = 10,
  disabled = false,
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);

      // Client-side validation
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`);
        toast.error(`File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          onChange(result.data.url);
          setFileName(result.data.originalName);
          toast.success('Tải file lên thành công');
        } else {
          setError(result.error || 'Có lỗi xảy ra');
          toast.error(result.error || 'Có lỗi xảy ra');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải file');
        toast.error('Có lỗi xảy ra khi tải file');
      } finally {
        setIsUploading(false);
      }
    },
    [category, maxSizeMB, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [disabled, handleUpload, isUploading]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = async () => {
    if (!value || disabled) return;

    if (value.startsWith('/uploads/')) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(value)}`, {
          method: 'DELETE',
        });
      } catch {
        // Silent fail
      }
    }

    onChange(null);
    setFileName(null);
    toast.success('Đã xóa file');
  };

  // Extract filename from URL if not set
  const displayName = fileName || (value ? value.split('/').pop() : null);

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
          <div className="rounded-lg bg-red-100 p-2">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {displayName}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-brand-navy hover:underline"
            >
              Xem file <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {!disabled && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50"
                title="Thay đổi file"
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="rounded-lg bg-red-500 p-2 text-white transition-all hover:bg-red-600"
                title="Xóa file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {isUploading && (
            <Loader2 className="h-5 w-5 animate-spin text-brand-gold" />
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
            isDragging
              ? 'border-brand-gold bg-brand-gold/10'
              : 'border-gray-300 hover:border-brand-gold hover:bg-gray-50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-gold" />
              <p className="text-sm font-medium text-gray-600">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-full bg-red-100 p-2">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <p className="mb-1 text-sm font-medium text-gray-700">
                {isDragging ? 'Thả file vào đây' : 'Kéo thả hoặc nhấn để chọn file'}
              </p>
              <p className="text-xs text-gray-500">PDF (tối đa {maxSizeMB}MB)</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {helpText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
