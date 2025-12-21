/**
 * Parent Authentication & Session Management
 * Using iron-session for secure, encrypted sessions
 */

import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface ParentSessionData {
  parentId: string;
  email: string;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'truong_viet_ngu_parent_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get current parent session
 */
export async function getParentSession(): Promise<IronSession<ParentSessionData>> {
  return getIronSession<ParentSessionData>(await cookies(), sessionOptions);
}

/**
 * Require parent authentication - throws if not logged in
 */
export async function requireParentAuth(): Promise<ParentSessionData> {
  const session = await getParentSession();

  if (!session.isLoggedIn || !session.parentId) {
    throw new Error('Unauthorized - Please log in');
  }

  return {
    parentId: session.parentId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    isLoggedIn: session.isLoggedIn,
  };
}

/**
 * Check if parent is logged in (doesn't throw)
 */
export async function isParentAuthenticated(): Promise<boolean> {
  const session = await getParentSession();
  return session.isLoggedIn === true && !!session.parentId;
}

/**
 * Get current parent (returns null if not logged in)
 */
export async function getCurrentParent(): Promise<ParentSessionData | null> {
  const session = await getParentSession();

  if (!session.isLoggedIn || !session.parentId) {
    return null;
  }

  return {
    parentId: session.parentId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    isLoggedIn: session.isLoggedIn,
  };
}
