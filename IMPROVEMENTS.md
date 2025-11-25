# Improvements & Suggestions

This document outlines recommended improvements, additional features, and architectural suggestions for the Truong Viet Ngu application.

---

## Immediate Improvements (Quick Wins)

### 1. Add Delete Confirmation Dialogs

**Current State**: Delete buttons immediately delete items without confirmation.

**Recommendation**: Create a reusable `ConfirmDialog` component.

```tsx
// components/ui/ConfirmDialog.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  trigger,
  variant = 'danger',
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Implementation...
}
```

### 2. Add Breadcrumbs to Admin Pages

**Current State**: No breadcrumb navigation in admin dashboard.

**Recommendation**: Add breadcrumbs for better navigation context.

```tsx
// Example: /admin/dashboard/classes/new
<Breadcrumb items={[
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Lớp học', href: '/admin/dashboard/classes' },
  { label: 'Tạo mới' },
]} />
```

### 3. Implement Pagination

**Current State**: All items loaded at once in list views.

**Recommendation**: Add pagination with limit/offset or cursor-based pagination.

```tsx
// Use searchParams for pagination
export default async function ClassesPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');

  const classes = await db.class.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await db.class.count();

  return (
    <ClassList
      classes={classes}
      pagination={{ page, limit, total }}
    />
  );
}
```

---

## UX Improvements

### 1. Form Auto-Save / Draft Mode

**Problem**: Users lose form data if they navigate away or page refreshes.

**Solution**: Implement auto-save to localStorage or database drafts.

```tsx
// Use localStorage for drafts
const [formData, setFormData] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('announcement_draft');
    return saved ? JSON.parse(saved) : defaultValues;
  }
  return defaultValues;
});

useEffect(() => {
  localStorage.setItem('announcement_draft', JSON.stringify(formData));
}, [formData]);
```

### 2. Keyboard Shortcuts

**Recommendation**: Add keyboard shortcuts for power users.

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save form |
| `Cmd/Ctrl + N` | New item |
| `Escape` | Cancel / Close modal |
| `/` | Focus search |

### 3. Better Date Handling

**Current State**: Basic HTML date inputs.

**Recommendation**: Use react-day-picker for better UX.

```bash
npm install react-day-picker date-fns
```

Benefits:
- Better mobile experience
- Vietnamese locale support
- Date range selection
- Calendar view

### 4. Image Preview Before Upload

**Current State**: Preview shown after upload completes.

**Recommendation**: Show preview immediately after file selection (before upload).

```tsx
const handleFileSelect = (file: File) => {
  // Show immediate preview
  const previewUrl = URL.createObjectURL(file);
  setPreviewUrl(previewUrl);

  // Then upload
  await uploadFile(file);
};
```

---

## Performance Optimizations

### 1. Database Query Optimization

**Issue**: N+1 queries when fetching related data.

**Solution**: Use Prisma includes/selects strategically.

```tsx
// Instead of
const classes = await db.class.findMany();
// Then fetching teacher for each class...

// Do this
const classes = await db.class.findMany({
  include: {
    teacher: {
      select: { firstName: true, lastName: true },
    },
    _count: {
      select: { enrollments: true },
    },
  },
});
```

### 2. Add Database Indexes

Review and add indexes for frequently queried columns:

```prisma
model Announcement {
  // ...
  @@index([isActive, priority, startDate])
  @@index([category])
}

model Student {
  // ...
  @@index([lastName, firstName])
  @@index([gradeLevel])
}
```

### 3. Implement Data Caching

Use Next.js caching features:

```tsx
// For static-ish data
export const revalidate = 3600; // Revalidate every hour

// Or use unstable_cache
import { unstable_cache } from 'next/cache';

const getCachedSettings = unstable_cache(
  async () => db.siteSetting.findUnique({ where: { id: 'site_settings' } }),
  ['site-settings'],
  { revalidate: 3600 }
);
```

### 4. Optimize Image Loading

```tsx
import Image from 'next/image';

// Always use Next.js Image component
<Image
  src={imageUrl}
  alt="Description"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="/placeholder.svg"
  loading="lazy"
/>
```

---

## Security Enhancements

### 1. Rate Limiting for Login

Prevent brute force attacks:

```tsx
// lib/rate-limit.ts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  // Block after 5 attempts
  if (attempts.count >= 5) {
    return false;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return true;
}
```

### 2. Password Reset Flow

Implement secure password reset:

1. User requests reset with email
2. Generate secure token (store hashed in DB)
3. Send email with reset link
4. Validate token and allow password change
5. Invalidate token after use

### 3. Content Security Policy

Add CSP headers in `next.config.ts`:

```tsx
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
];
```

### 4. Input Sanitization

For any HTML content (if rich text editor is added):

```tsx
import DOMPurify from 'dompurify';

const sanitizedHtml = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target'],
});
```

---

## Additional Features

### 1. Email Notifications

**When to Send**:
- New announcement posted (to relevant parents)
- Student enrolled/unenrolled
- Class schedule changes
- Password reset

**Implementation**: Use Resend or SendGrid

```bash
npm install resend
```

```tsx
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAnnouncementEmail(
  to: string[],
  announcement: { title: string; description: string }
) {
  await resend.emails.send({
    from: 'Truong Viet Ngu <noreply@yourdomain.com>',
    to,
    subject: `Thông báo: ${announcement.title}`,
    html: `<h1>${announcement.title}</h1><p>${announcement.description}</p>`,
  });
}
```

### 2. PDF Report Generation

Generate class lists, attendance reports, etc.

```bash
npm install @react-pdf/renderer
```

### 3. Export Functionality

Allow exporting data to CSV/Excel:

```tsx
// lib/export.ts
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
}
```

### 4. Vietnamese Spell Check

For announcements and descriptions, consider adding Vietnamese spell checking hints.

### 5. Multi-Language Support

If needed in future, prepare for i18n:

```bash
npm install next-intl
```

Structure:
```
messages/
├── vi.json
└── en.json
```

---

## Code Architecture Suggestions

### 1. Create Shared Type Definitions

```tsx
// types/index.ts
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export type GradeLevel =
  | 'MAU_GIAO_A' | 'MAU_GIAO_B' | 'MAU_GIAO_C'
  | 'LOP_1' | 'LOP_2' | 'LOP_3' | 'LOP_4' | 'LOP_5' | 'LOP_6' | 'LOP_7'
  | 'AU_NHI' | 'THIEU_NHI' | 'NGHIA_SI' | 'HIEP_SI';
```

### 2. Extract Common UI Components

Create a consistent design system:

```
components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Textarea.tsx
├── Card.tsx
├── Badge.tsx
├── Modal.tsx
├── Toaster.tsx
├── ImageUpload.tsx
├── FileUpload.tsx
└── index.ts
```

### 3. Create Form Field Components

```tsx
// components/ui/FormField.tsx
interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FormField({ label, name, required, error, helpText, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
```

### 4. Implement Error Boundary

```tsx
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Có lỗi xảy ra
          </h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-brand-navy underline"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```bash
npm install -D vitest @testing-library/react
```

Test coverage priorities:
1. Validation schemas (Zod)
2. Server action logic
3. Utility functions
4. UI components

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
```

Test scenarios:
1. Login/logout flow
2. CRUD operations for each entity
3. Public website navigation
4. Form validation

---

## Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Track runtime errors, slow queries, and user issues.

### 2. Analytics

Consider adding:
- Page views
- User engagement
- Feature usage
- Performance metrics

Options: Vercel Analytics, Plausible, or PostHog

### 3. Logging

Add structured logging for debugging:

```tsx
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...meta,
      timestamp: new Date().toISOString()
    }));
  },
};
```

---

## Summary

### Priority Order

1. **Critical**: Delete confirmations, pagination
2. **High**: Breadcrumbs, loading states, search
3. **Medium**: Email notifications, reports, calendar
4. **Low**: PWA, mobile app, payment integration

### Quick Wins (Can implement today)

1. Add confirmation dialogs
2. Add breadcrumbs
3. Add pagination
4. Optimize database queries
5. Add loading skeletons

### Long-term Goals

1. Parent portal
2. Attendance tracking
3. Payment integration
4. Mobile app

---

*Last updated: November 2024*
