/**
 * Teacher Authentication & Session Management
 * Using iron-session for secure, encrypted sessions
 */

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface TeacherSessionData {
  teacherId: string;
  email: string;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'truong_viet_ngu_teacher_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get current teacher session
 */
export async function getTeacherSession(): Promise<IronSession<TeacherSessionData>> {
  return getIronSession<TeacherSessionData>(await cookies(), sessionOptions);
}

/**
 * Require teacher authentication - throws if not logged in
 */
export async function requireTeacherAuth(): Promise<TeacherSessionData> {
  const session = await getTeacherSession();

  if (!session.isLoggedIn || !session.teacherId) {
    throw new Error('Unauthorized - Please log in');
  }

  return {
    teacherId: session.teacherId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    isLoggedIn: session.isLoggedIn,
  };
}

/**
 * Check if teacher is logged in (doesn't throw)
 */
export async function isTeacherAuthenticated(): Promise<boolean> {
  const session = await getTeacherSession();
  return session.isLoggedIn === true && !!session.teacherId;
}

/**
 * Get current teacher (returns null if not logged in)
 */
export async function getCurrentTeacher(): Promise<TeacherSessionData | null> {
  const session = await getTeacherSession();

  if (!session.isLoggedIn || !session.teacherId) {
    return null;
  }

  return {
    teacherId: session.teacherId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    isLoggedIn: session.isLoggedIn,
  };
}
