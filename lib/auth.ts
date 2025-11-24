/**
 * Authentication & Session Management
 * Using iron-session for secure, encrypted sessions
 */

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  adminId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'truong_viet_ngu_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get current session
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

/**
 * Require authentication - throws if not logged in
 * Use this in Server Components and Server Actions
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.adminId) {
    throw new Error('Unauthorized - Please log in');
  }

  return {
    adminId: session.adminId,
    email: session.email,
    name: session.name,
    role: session.role,
    isLoggedIn: session.isLoggedIn,
  };
}

/**
 * Check if user is logged in (doesn't throw)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && !!session.adminId;
}

/**
 * Get current admin (returns null if not logged in)
 */
export async function getCurrentAdmin(): Promise<SessionData | null> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.adminId) {
    return null;
  }

  return {
    adminId: session.adminId,
    email: session.email,
    name: session.name,
    role: session.role,
    isLoggedIn: session.isLoggedIn,
  };
}
