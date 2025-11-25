'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  category: 'logos' | 'classrooms' | 'class-photos' | 'hero' | 'announcements' | 'teachers' | 'materials' | 'general';
  label?: string;
  helpText?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  category,
  label,
  helpText,
  accept = 'image/*',
  maxSizeMB = 5,
  disabled = false,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          toast.success('Tải ảnh lên thành công');
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
    // Reset input so same file can be selected again
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

    // Only attempt to delete from server if it's an uploaded file
    if (value.startsWith('/uploads/')) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(value)}`, {
          method: 'DELETE',
        });
      } catch {
        // Silent fail - file might already be deleted
      }
    }

    onChange(null);
    toast.success('Đã xóa ảnh');
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Preview or Upload Area */}
      {value ? (
        <div className="relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50">
          <div className="relative aspect-video w-full">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          {!disabled && (
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="rounded-lg bg-white/90 p-2 text-gray-700 shadow-md transition-all hover:bg-white hover:shadow-lg"
                title="Thay đổi ảnh"
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="rounded-lg bg-red-500/90 p-2 text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
                title="Xóa ảnh"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
            isDragging
              ? 'border-brand-gold bg-brand-gold/10'
              : 'border-gray-300 hover:border-brand-gold hover:bg-gray-50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-gold" />
              <p className="text-sm font-medium text-gray-600">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className="mb-3 rounded-full bg-brand-gold/10 p-3">
                <ImageIcon className="h-8 w-8 text-brand-gold" />
              </div>
              <p className="mb-1 text-sm font-medium text-gray-700">
                {isDragging ? 'Thả file vào đây' : 'Kéo thả hoặc nhấn để chọn ảnh'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP (tối đa {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Help text */}
      {helpText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
