/**
 * Simple in-memory rate limiter for login attempts
 *
 * For production use with multiple instances, consider using Redis or a database.
 * This implementation is suitable for single-instance deployments.
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

// Store login attempts by identifier (email or IP)
const loginAttempts = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5; // Maximum attempts before blocking
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Cleanup every 5 minutes

// Periodic cleanup of old entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of loginAttempts.entries()) {
      if (now - entry.lastAttempt > WINDOW_MS) {
        loginAttempts.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

export interface RateLimitResult {
  success: boolean;
  remainingAttempts: number;
  resetInSeconds: number;
}

/**
 * Check if login attempt is allowed
 * @param identifier - Email address or IP to track
 * @returns RateLimitResult
 */
export function checkLoginRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const normalizedId = identifier.toLowerCase().trim();
  const entry = loginAttempts.get(normalizedId);

  // No previous attempts
  if (!entry) {
    return {
      success: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetInSeconds: 0,
    };
  }

  // Check if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    // Reset the entry
    loginAttempts.delete(normalizedId);
    return {
      success: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetInSeconds: 0,
    };
  }

  // Check if max attempts reached
  if (entry.count >= MAX_ATTEMPTS) {
    const resetTime = Math.ceil((WINDOW_MS - (now - entry.firstAttempt)) / 1000);
    return {
      success: false,
      remainingAttempts: 0,
      resetInSeconds: resetTime,
    };
  }

  // Allowed, but track this attempt
  return {
    success: true,
    remainingAttempts: MAX_ATTEMPTS - entry.count - 1,
    resetInSeconds: 0,
  };
}

/**
 * Record a failed login attempt
 * @param identifier - Email address or IP to track
 */
export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const normalizedId = identifier.toLowerCase().trim();
  const entry = loginAttempts.get(normalizedId);

  if (!entry) {
    loginAttempts.set(normalizedId, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return;
  }

  // Reset if window expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(normalizedId, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return;
  }

  // Increment count
  entry.count++;
  entry.lastAttempt = now;
}

/**
 * Reset rate limit for an identifier (after successful login)
 * @param identifier - Email address or IP to clear
 */
export function resetRateLimit(identifier: string): void {
  const normalizedId = identifier.toLowerCase().trim();
  loginAttempts.delete(normalizedId);
}

/**
 * Format remaining time in Vietnamese
 * @param seconds - Seconds remaining
 * @returns Formatted string
 */
export function formatRemainingTime(seconds: number): string {
  if (seconds <= 60) {
    return `${seconds} giây`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} phút`;
}
