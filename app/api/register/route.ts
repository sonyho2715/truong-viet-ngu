import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { GradeLevel } from '@prisma/client';

const registrationSchema = z.object({
  // Student Info
  studentFirstName: z.string().min(1, 'Tên học sinh là bắt buộc'),
  studentLastName: z.string().min(1, 'Họ học sinh là bắt buộc'),
  studentDOB: z.string().min(1, 'Ngày sinh là bắt buộc'),
  preferredGrade: z.string().optional(),
  // Parent 1 Info
  parentFirstName: z.string().min(1, 'Tên phụ huynh là bắt buộc'),
  parentLastName: z.string().min(1, 'Họ phụ huynh là bắt buộc'),
  parentEmail: z.string().email('Email không hợp lệ'),
  parentPhone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  parentRelation: z.string().min(1, 'Quan hệ với học sinh là bắt buộc'),
  // Parent 2 Info (optional)
  parent2FirstName: z.string().optional(),
  parent2LastName: z.string().optional(),
  parent2Email: z.string().email().optional().or(z.literal('')),
  parent2Phone: z.string().optional(),
  parent2Relation: z.string().optional(),
  // Address
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  city: z.string().min(1, 'Thành phố là bắt buộc'),
  state: z.string().min(1, 'Tiểu bang là bắt buộc'),
  zipCode: z.string().min(1, 'Mã bưu điện là bắt buộc'),
  // Emergency Contact
  emergencyName: z.string().min(1, 'Tên người liên hệ khẩn cấp là bắt buộc'),
  emergencyPhone: z.string().min(1, 'Số điện thoại khẩn cấp là bắt buộc'),
  emergencyRelation: z.string().min(1, 'Quan hệ là bắt buộc'),
  // Additional Info
  previousSchool: z.string().optional(),
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
  howHeard: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registrationSchema.parse(body);

    // Parse the date
    const studentDOB = new Date(validated.studentDOB);

    // Create the registration application
    const application = await db.registrationApplication.create({
      data: {
        studentFirstName: validated.studentFirstName,
        studentLastName: validated.studentLastName,
        studentDOB,
        preferredGrade: validated.preferredGrade ? (validated.preferredGrade as GradeLevel) : null,
        parentFirstName: validated.parentFirstName,
        parentLastName: validated.parentLastName,
        parentEmail: validated.parentEmail,
        parentPhone: validated.parentPhone,
        parentRelation: validated.parentRelation,
        parent2FirstName: validated.parent2FirstName || null,
        parent2LastName: validated.parent2LastName || null,
        parent2Email: validated.parent2Email || null,
        parent2Phone: validated.parent2Phone || null,
        parent2Relation: validated.parent2Relation || null,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        zipCode: validated.zipCode,
        emergencyName: validated.emergencyName,
        emergencyPhone: validated.emergencyPhone,
        emergencyRelation: validated.emergencyRelation,
        previousSchool: validated.previousSchool || null,
        medicalNotes: validated.medicalNotes || null,
        allergies: validated.allergies || null,
        specialNeeds: validated.specialNeeds || null,
        howHeard: validated.howHeard || null,
        additionalNotes: validated.additionalNotes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      data: { id: application.id },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thông tin không hợp lệ',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi gửi đơn đăng ký',
      },
      { status: 500 }
    );
  }
}
