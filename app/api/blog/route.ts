import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const blogPostSchema = z.object({
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
  isPublished: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = blogPostSchema.parse(body);

    // Check for duplicate slug
    const existingPost = await db.blogPost.findUnique({
      where: { slug: validated.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Đường dẫn này đã tồn tại' },
        { status: 400 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        ...validated,
        publishedAt: validated.isPublished ? new Date() : null,
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

    console.error('Blog API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo bài viết' },
      { status: 500 }
    );
  }
}
