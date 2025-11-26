import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const absenceReportSchema = z.object({
  studentName: z.string().min(1, 'Tên học sinh không được để trống'),
  parentName: z.string().min(1, 'Tên phụ huynh không được để trống'),
  parentEmail: z.string().email('Email không hợp lệ'),
  parentPhone: z.string().optional(),
  absenceDate: z.string().min(1, 'Ngày nghỉ không được để trống'),
  reason: z.string().min(1, 'Lý do không được để trống'),
  additionalNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = absenceReportSchema.parse(body);

    const report = await db.absenceReport.create({
      data: {
        studentName: validated.studentName,
        parentName: validated.parentName,
        parentEmail: validated.parentEmail,
        parentPhone: validated.parentPhone || null,
        absenceDate: new Date(validated.absenceDate),
        reason: validated.reason,
        additionalNotes: validated.additionalNotes || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to create absence report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
