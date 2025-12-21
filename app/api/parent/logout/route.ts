import { NextResponse } from 'next/server';
import { getParentSession } from '@/lib/parent-auth';

export async function POST() {
  try {
    const session = await getParentSession();
    session.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Parent logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi đăng xuất' },
      { status: 500 }
    );
  }
}
