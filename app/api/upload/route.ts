import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { requireAuth } from '@/lib/auth';

// Valid upload categories
const VALID_CATEGORIES = [
  'logos',
  'classrooms',
  'class-photos',
  'hero',
  'announcements',
  'teachers',
  'materials',
  'general',
  'slideshow',
  'gallery',
] as const;

type UploadCategory = (typeof VALID_CATEGORIES)[number];

// Allowed file types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Generate a unique filename
 */
function generateFilename(originalName: string, category: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  return `${category}/${safeName}-${timestamp}-${random}.${ext}`;
}

/**
 * Validate file type and size
 */
function validateFile(
  file: File,
  category: UploadCategory
): { valid: boolean; error?: string } {
  const isDocument = category === 'materials';
  const allowedTypes = isDocument
    ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]
    : ALLOWED_IMAGE_TYPES;
  const maxSize = isDocument ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Loại file không hợp lệ. Chỉ chấp nhận: ${
        isDocument ? 'ảnh hoặc PDF' : 'ảnh (JPEG, PNG, GIF, WebP, SVG)'
      }`,
    };
  }

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa: ${maxMB}MB`,
    };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không có file được tải lên' },
        { status: 400 }
      );
    }

    if (!category || !VALID_CATEGORIES.includes(category as UploadCategory)) {
      return NextResponse.json(
        { success: false, error: 'Danh mục không hợp lệ' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const validation = validateFile(file, category as UploadCategory);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename with category prefix
    const filename = generateFilename(file.name, category);

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: blob.url,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Bạn cần đăng nhập để tải file lên' },
        { status: 401 }
      );
    }

    // Check for Vercel Blob configuration error
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { success: false, error: 'Chưa cấu hình Vercel Blob. Vui lòng thêm BLOB_READ_WRITE_TOKEN.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tải file lên' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'URL file không hợp lệ' },
        { status: 400 }
      );
    }

    // Delete from Vercel Blob
    await del(fileUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa file' },
      { status: 500 }
    );
  }
}
