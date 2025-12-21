import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Đường dẫn là bắt buộc'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  category: z.enum([
    'NEWS',
    'ANNOUNCEMENT',
    'EVENT_RECAP',
    'STUDENT_SPOTLIGHT',
    'TEACHER_SPOTLIGHT',
    'COMMUNITY',
    'TNTT',
    'GENERAL',
  ]),
  featuredImage: z.string().optional(),
  tags: z.string().optional(),
  authorName: z.string().optional(),
  isPublished: z.boolean(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const post = await db.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Blog GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateSchema.parse(body);

    // Check if post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    // Check for duplicate slug (excluding current post)
    const duplicateSlug = await db.blogPost.findFirst({
      where: {
        slug: validated.slug,
        id: { not: id },
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { success: false, error: 'Đường dẫn này đã tồn tại' },
        { status: 400 }
      );
    }

    // Handle publishedAt date
    let publishedAt = existingPost.publishedAt;
    if (validated.isPublished && !existingPost.isPublished) {
      // First time publishing
      publishedAt = new Date();
    } else if (!validated.isPublished) {
      // Unpublishing
      publishedAt = null;
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...validated,
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Thông tin không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Blog PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi cập nhật' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existingPost = await db.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    await db.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa' },
      { status: 500 }
    );
  }
}
