import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
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
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName).toLowerCase();
  const safeName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  return `${safeName}-${timestamp}-${random}${ext}`;
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

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = generateFilename(file.name);
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${category}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
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

    if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
      return NextResponse.json(
        { success: false, error: 'URL file không hợp lệ' },
        { status: 400 }
      );
    }

    const { unlink } = await import('fs/promises');
    const filepath = path.join(process.cwd(), 'public', fileUrl);

    // Security check: ensure the file is within uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const resolvedPath = path.resolve(filepath);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { success: false, error: 'Đường dẫn không hợp lệ' },
        { status: 400 }
      );
    }

    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa file' },
      { status: 500 }
    );
  }
}
