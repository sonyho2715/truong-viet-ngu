import { NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/teacher-auth';

export async function POST() {
  try {
    const session = await getTeacherSession();
    session.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Teacher logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}
