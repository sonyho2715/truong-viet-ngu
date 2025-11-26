import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  generateCSV,
  studentExportHeaders,
  classExportHeaders,
  teacherExportHeaders,
  gradeLevelLabels,
} from '@/lib/export';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn || !session.adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['students', 'classes', 'teachers'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid export type' },
        { status: 400 }
      );
    }

    let csv = '';
    let filename = '';

    switch (type) {
      case 'students': {
        const students = await db.student.findMany({
          orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        });

        const exportData = students.map((student) => ({
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          gradeLevel: student.gradeLevel
            ? gradeLevelLabels[student.gradeLevel] || student.gradeLevel
            : '',
          parentName: student.parentName || '',
          parentEmail: student.parentEmail || '',
          parentPhone: student.parentPhone || '',
          isActive: student.isActive,
          createdAt: student.createdAt,
        }));

        csv = generateCSV(exportData, {
          filename: 'students',
          headers: studentExportHeaders,
        });
        filename = `hoc-sinh-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      }

      case 'classes': {
        const classes = await db.class.findMany({
          include: {
            teacher: {
              select: { firstName: true, lastName: true },
            },
            _count: {
              select: { enrollments: true },
            },
          },
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        });

        const exportData = classes.map((cls) => ({
          name: cls.name,
          gradeLevel: gradeLevelLabels[cls.gradeLevel] || cls.gradeLevel,
          schedule: cls.schedule || '',
          roomNumber: cls.roomNumber || '',
          teacherName: cls.teacher
            ? `${cls.teacher.firstName} ${cls.teacher.lastName}`
            : '',
          studentCount: cls._count.enrollments,
          isActive: cls.isActive,
        }));

        csv = generateCSV(exportData, {
          filename: 'classes',
          headers: classExportHeaders,
        });
        filename = `lop-hoc-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      }

      case 'teachers': {
        const teachers = await db.teacher.findMany({
          include: {
            _count: {
              select: { classes: true },
            },
          },
          orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        });

        const exportData = teachers.map((teacher) => ({
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          phone: teacher.phone || '',
          classCount: teacher._count.classes,
          isActive: teacher.isActive,
        }));

        csv = generateCSV(exportData, {
          filename: 'teachers',
          headers: teacherExportHeaders,
        });
        filename = `giao-vien-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      }
    }

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
