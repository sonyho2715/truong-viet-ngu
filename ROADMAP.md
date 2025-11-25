# Truong Viet Ngu - Feature Roadmap

## Overview

This document outlines the development roadmap for the Truong Viet Ngu (Vietnamese Language School) application. Features are organized by priority and complexity.

---

## Phase 1: Production Ready (Current Sprint)

### Completed
- [x] Core CRUD operations (Announcements, Classes, Teachers, Students, Materials)
- [x] Authentication system (iron-session)
- [x] Admin dashboard
- [x] Public website with dynamic content
- [x] Toast notifications (sonner)
- [x] Image upload for Classes, Teachers, Students
- [x] PDF upload for Learning Materials
- [x] Responsive design

### In Progress
- [ ] Delete confirmation dialogs
- [ ] Settings form with image upload (logos, hero)
- [ ] Add .gitkeep files to upload directories

---

## Phase 2: Enhanced User Experience

### Priority: High

#### 1. Confirmation Dialogs
- Add modal confirmation before delete actions
- Implement using a reusable `ConfirmDialog` component
- Apply to all delete buttons across the admin dashboard

#### 2. Loading States & Skeletons
- Add skeleton loading components for:
  - Dashboard statistics cards
  - List pages (announcements, classes, students)
  - Form pages while data loads
- Implement using CSS animations or a library like `react-loading-skeleton`

#### 3. Error Pages
- Create custom `404.tsx` (not found)
- Create custom `500.tsx` (server error)
- Design consistent with brand aesthetics

#### 4. Search Functionality
- Add global search in admin dashboard
- Search across announcements, classes, teachers, students
- Implement using Prisma full-text search or simple LIKE queries

#### 5. Bulk Operations
- Multi-select for list items
- Bulk delete functionality
- Bulk status toggle (active/inactive)

---

## Phase 3: Public Website Enhancements

### Priority: Medium

#### 1. Calendar Page
- Implement full calendar view
- Show school events and class schedules
- Use a library like `react-big-calendar` or `@fullcalendar/react`
- Allow filtering by class/category

#### 2. TNTT Section
- Complete the TNTT (Thieu Nhi Thanh The) section
- Display TNTT-specific classes
- Show TNTT activities and events
- Include TNTT photos gallery

#### 3. Photo Gallery
- Create gallery page with categories
- Lightbox view for images
- Filter by year/event/class
- Admin interface to manage gallery images

#### 4. Learning Materials Public Page
- Public-facing page for parents to access materials
- Organized by grade level
- Download/view functionality for PDFs
- External link handling

#### 5. Contact Form
- Add contact form on public website
- Email notification to admin
- Implement with Server Action
- Add honeypot spam protection

---

## Phase 4: Parent Portal

### Priority: Medium-High

#### 1. Parent Registration/Login
- Separate authentication for parents
- Link parent accounts to students
- Self-service registration flow

#### 2. Student Progress View
- Parents can view their children's enrollment
- Class information and schedule
- Teacher contact information

#### 3. Attendance Records
- View attendance history
- Receive attendance notifications

#### 4. Communication
- Receive announcements relevant to their classes
- Direct messaging with teachers (optional)

---

## Phase 5: Advanced Admin Features

### Priority: Medium

#### 1. Rich Text Editor
- Implement Tiptap or similar for announcements
- Support for:
  - Bold, italic, underline
  - Lists (ordered/unordered)
  - Links
  - Basic formatting
- Store as HTML in database

#### 2. Attendance Tracking
- Mark student attendance per class session
- Attendance reports by student/class
- Export attendance data

#### 3. Reports & Analytics
- Dashboard with key metrics
- Student enrollment trends
- Class capacity tracking
- Export reports to PDF/Excel

#### 4. Audit Log
- Track all admin actions
- Who did what and when
- AuditLog model already exists in schema

#### 5. Admin User Management
- Super admin can manage other admins
- Role-based permissions
- Invite new admin users

#### 6. Email Notifications
- Announcement notifications to parents
- Enrollment confirmations
- Schedule change alerts
- Use SendGrid, Resend, or AWS SES

---

## Phase 6: Mobile & Performance

### Priority: Low-Medium

#### 1. PWA Support
- Add service worker
- Offline support for basic pages
- Push notifications capability

#### 2. Performance Optimization
- Image optimization with Next.js Image
- Lazy loading for lists
- Database query optimization
- Add Redis caching (optional)

#### 3. Mobile App (Future)
- React Native app for parents
- Push notifications
- Offline attendance viewing

---

## Phase 7: Integrations

### Priority: Low

#### 1. Payment Integration
- Tuition fee payment (Stripe)
- Registration fees
- Donation handling

#### 2. External Calendar Sync
- Google Calendar integration
- Export ICS files

#### 3. SMS Notifications
- Twilio integration for urgent announcements
- Attendance alerts to parents

---

## Technical Debt & Improvements

### Code Quality
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up CI/CD pipeline
- [ ] Add Sentry for error tracking

### Security
- [ ] Add rate limiting for login
- [ ] Implement password reset flow
- [ ] Add 2FA for admin accounts
- [ ] Regular security audits

### Documentation
- [ ] API documentation (if public API needed)
- [ ] User guide for admin dashboard
- [ ] Deployment guide

---

## Implementation Notes

### When Adding New Features

1. **Plan First**: Create a design document or outline
2. **Database Schema**: Update Prisma schema if needed
3. **Server Actions**: Use Server Actions over API routes
4. **Validation**: Always use Zod for input validation
5. **UI Consistency**: Follow existing component patterns
6. **Testing**: Test manually before deploying
7. **Documentation**: Update relevant documentation

### Recommended Libraries

| Purpose | Library | Notes |
|---------|---------|-------|
| Rich Text Editor | Tiptap | Headless, extensible |
| Calendar | FullCalendar | React compatible |
| Date Picker | react-day-picker | Lightweight |
| Charts | Recharts | React native |
| PDF Generation | @react-pdf/renderer | For reports |
| Email | Resend | Simple API |
| Testing | Vitest + Playwright | Fast unit + E2E |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12 | Initial release with core features |
| 1.1.0 | TBD | Toast notifications, file upload |
| 1.2.0 | TBD | Confirmation dialogs, search |
| 2.0.0 | TBD | Parent portal |

---

## Contributing

When implementing features from this roadmap:

1. Reference this document in commit messages
2. Update the checkbox when feature is complete
3. Add notes about implementation decisions
4. Update version history

---

*Last updated: November 2024*
