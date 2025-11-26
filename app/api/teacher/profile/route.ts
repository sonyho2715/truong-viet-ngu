import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTeacherSession } from '@/lib/teacher-auth';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Họ không được để trống'),
  lastName: z.string().min(1, 'Tên không được để trống'),
  phone: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getTeacherSession();
    if (!session?.teacherId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const teacher = await db.teacher.findUnique({
      where: { id: session.teacherId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        photoUrl: true,
        bio: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Failed to fetch teacher profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getTeacherSession();
    if (!session?.teacherId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const teacher = await db.teacher.update({
      where: { id: session.teacherId },
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone || null,
        bio: validated.bio || null,
        photoUrl: validated.photoUrl || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        photoUrl: true,
        bio: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    // Update session with new name
    session.firstName = teacher.firstName;
    session.lastName = teacher.lastName;
    await session.save();

    return NextResponse.json({ success: true, data: teacher });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to update teacher profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
