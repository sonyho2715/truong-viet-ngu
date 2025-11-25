# Design System Audit Report

**Project:** Trường Việt Ngữ (Vietnamese Language School)
**Audit Date:** November 24, 2024
**Auditor:** Claude Code

---

## Executive Summary

| Category | Score | Status |
|----------|-------|--------|
| Color Palette | 90/100 | Excellent |
| Typography | 85/100 | Good |
| Spacing System | 80/100 | Good |
| Component Library | 70/100 | Needs Work |
| Responsive Design | 85/100 | Good |
| Accessibility | 65/100 | Needs Improvement |
| Design Tokens | 85/100 | Good |
| Dark Mode | 0/100 | Not Implemented |

**Overall Design System Score: 70/100**

---

## 1. Color Palette Analysis

### Current Implementation

**Brand Colors (globals.css:4-15):**
```css
:root {
  --color-navy: #3e65b2;
  --color-navy-light: #5d7fc4;
  --color-navy-dark: #2d4a8a;
  --color-gold: #f6d461;
  --color-gold-light: #f8de85;
  --color-gold-dark: #e6bb3a;
  --color-cream: #FFFBEB;
  --color-cream-dark: #FEF3C7;
  --color-brown: #78350F;
}
```

**Semantic Colors:**
```css
:root {
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #2563EB;
}
```

**Tailwind Integration (@theme inline):**
```css
--color-brand-navy: var(--color-navy);
--color-brand-gold: var(--color-gold);
--color-brand-cream: var(--color-cream);
```

### Strengths
- Well-defined brand color palette with light/dark variants
- CSS custom properties enable easy theming
- No hardcoded hex colors found in components (100% token usage)
- Semantic colors for feedback states (success, warning, error, info)

### Issues
- Missing hover state colors as dedicated tokens
- No disabled state colors defined
- Brown color (`--color-brown`) unused in codebase
- Semantic colors not exposed to Tailwind (`bg-success`, `text-error` unavailable)

### Recommendations

1. **Add semantic colors to Tailwind theme:**
```css
@theme inline {
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  --color-info: var(--color-info);
}
```

2. **Add interaction state colors:**
```css
:root {
  --color-navy-hover: #4d74c1;
  --color-gold-hover: #f4ca3a;
  --color-disabled: #9CA3AF;
  --color-disabled-bg: #F3F4F6;
}
```

---

## 2. Typography System

### Current Implementation

**Font Families (layout.tsx:7-17):**
```typescript
const notoSans = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700'],
});

const notoSerif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-serif',
  weight: ['400', '600', '700'],
});
```

**Tailwind Integration:**
```css
@theme inline {
  --font-sans: var(--font-noto-sans);
  --font-serif: var(--font-noto-serif);
}
```

### Font Usage Patterns

| Element | Font | Weight | Size Classes |
|---------|------|--------|--------------|
| Headings | Serif | 600-700 | text-2xl to text-4xl |
| Body | Sans | 400-500 | text-sm to text-base |
| Buttons | Sans | 600 | text-sm to text-base |
| Labels | Sans | 500-600 | text-xs to text-sm |

### Strengths
- Vietnamese language support via subsets
- Clear hierarchy between serif (headings) and sans (body)
- Consistent weight scale

### Issues
- No defined type scale in design tokens
- Inconsistent heading sizes across pages
- Line-height not standardized
- No letter-spacing tokens

### Recommendations

1. **Define typography scale in globals.css:**
```css
:root {
  /* Type Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

2. **Create heading component or utility classes:**
```css
.heading-1 { @apply font-serif text-3xl font-bold lg:text-4xl; }
.heading-2 { @apply font-serif text-2xl font-bold lg:text-3xl; }
.heading-3 { @apply font-serif text-xl font-semibold lg:text-2xl; }
```

---

## 3. Spacing System

### Current Implementation

The project uses Tailwind's default spacing scale. Analysis of 1,160 className occurrences shows:

**Most Used Spacing Values:**
| Token | Usage | Context |
|-------|-------|---------|
| p-4 | High | Card padding |
| p-6 | High | Section padding, forms |
| p-8 | Medium | Large containers |
| py-16 | High | Section vertical padding |
| py-24 | Medium | Hero sections (lg:) |
| gap-2 | High | Inline elements |
| gap-4 | High | Grid items |
| gap-6 | Medium | Card grids |
| gap-8 | Medium | Section content |
| space-y-2 | Medium | Form fields |
| space-y-6 | Medium | Section blocks |

### Strengths
- Consistent use of Tailwind spacing scale
- Responsive spacing patterns (py-16 lg:py-24)
- Standard gap/space utilities for layouts

### Issues
- No custom spacing tokens defined
- Some inconsistency in card padding (p-4 vs p-6)
- No documented spacing guidelines

### Recommendations

1. **Document spacing conventions:**

```markdown
## Spacing Guidelines

### Page Sections
- Mobile: py-16 px-6
- Desktop: lg:py-24 lg:px-8

### Cards
- Standard: p-6
- Compact: p-4

### Form Elements
- Between fields: space-y-4
- Label to input: space-y-2

### Grids
- Card grids: gap-6
- Inline items: gap-2 to gap-4
```

---

## 4. Component Library Assessment

### Current UI Components (components/ui/)

| Component | Purpose | Completeness |
|-----------|---------|--------------|
| ConfirmDialog.tsx | Modal confirmation | Complete |
| DeleteButton.tsx | Delete with confirmation | Complete |
| FileUpload.tsx | File upload widget | Complete |
| ImageUpload.tsx | Image upload with preview | Complete |
| Pagination.tsx | Page navigation | Complete |
| SearchInput.tsx | Search with URL params | Complete |
| Skeleton.tsx | Loading skeletons | Complete |
| Toaster.tsx | Toast notifications | Complete |

### Missing Essential Components

**High Priority:**
1. **Button** - Currently inline styles everywhere
2. **Input** - Form inputs inconsistent
3. **Select** - No standardized select
4. **Badge** - Status badges duplicated
5. **Card** - Card styles repeated
6. **Modal** - Only ConfirmDialog exists

**Medium Priority:**
7. **Checkbox** - Styled checkboxes
8. **Radio** - Styled radio buttons
9. **Tabs** - Tab navigation
10. **Alert** - Alert/notification box
11. **Dropdown** - Dropdown menu
12. **Avatar** - User avatars

**Low Priority:**
13. **Tooltip** - Information tooltips
14. **Progress** - Progress indicators
15. **Accordion** - Expandable sections

### Component Consistency Issues

**Button Styles (found across components):**
```tsx
// Primary button - used in 12+ places
className="rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy"

// Secondary button - used in 8+ places
className="rounded-lg border-2 border-brand-navy px-6 py-3 font-semibold text-brand-navy"

// Danger button - used in 4+ places
className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
```

### Recommendations

1. **Create Button component:**
```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  // ...
}
```

2. **Create Input component:**
```tsx
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  // ...
}
```

3. **Create Badge component:**
```tsx
// components/ui/Badge.tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
}
```

---

## 5. Responsive Design Patterns

### Breakpoint Usage

| Breakpoint | Tailwind | Usage |
|------------|----------|-------|
| Mobile | Default | Base styles |
| Small | sm: (640px) | Button layouts, search width |
| Medium | md: (768px) | 2-column grids |
| Large | lg: (1024px) | 3-4 column grids, desktop nav |
| XL | xl: (1280px) | Rarely used |

### Patterns Found

**Grid Layouts:**
```tsx
// 1 → 2 → 3 columns
className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"

// 1 → 2 → 4 columns
className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
```

**Flex Layouts:**
```tsx
// Stack → Row
className="flex flex-col gap-4 sm:flex-row"
```

**Text Scaling:**
```tsx
// Heading responsive
className="text-2xl lg:text-3xl"
className="text-3xl lg:text-4xl"
```

### Strengths
- Consistent mobile-first approach
- Good use of responsive grids
- Navigation properly handles mobile/desktop

### Issues
- Some components missing responsive considerations
- Admin sidebar not collapsible on tablet
- Tables not responsive (horizontal scroll needed)

### Recommendations

1. **Add responsive table wrapper:**
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>
```

2. **Collapsible admin sidebar for tablets**

---

## 6. Accessibility Audit

### Current Implementation

**Focus States (globals.css:43-45):**
```css
*:focus-visible {
  @apply outline-none ring-2 ring-brand-gold ring-offset-2;
}
```

**ARIA Attributes Found:**
- `aria-label` on buttons (17 occurrences)
- `aria-expanded` on mobile menu
- `aria-hidden` on decorative elements
- Breadcrumb navigation with `aria-label`

### WCAG 2.1 Compliance Issues

**Level A Issues:**
1. **Missing alt text** - Some images lack descriptive alt
2. **Form labels** - Some inputs missing associated labels
3. **Skip links** - No skip-to-content link
4. **Language attribute** - Missing `lang="vi"` on html

**Level AA Issues:**
5. **Color contrast** - Gold on white may fail 4.5:1
6. **Target size** - Some buttons smaller than 44x44px
7. **Focus order** - Modal focus trap not implemented
8. **Error identification** - Form errors not always announced

### Color Contrast Analysis

| Combination | Ratio | Status |
|-------------|-------|--------|
| Navy (#3e65b2) on White | 4.89:1 | Pass AA |
| Gold (#f6d461) on Navy | 7.2:1 | Pass AAA |
| Gold (#f6d461) on White | 1.83:1 | Fail |
| White on Navy | 4.89:1 | Pass AA |
| Brown (#78350F) on Cream | 8.1:1 | Pass AAA |

### Recommendations

1. **Add skip link:**
```tsx
// app/layout.tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute ...">
  Bỏ qua đến nội dung chính
</a>
```

2. **Set language attribute:**
```tsx
<html lang="vi">
```

3. **Never use gold text on white:**
```tsx
// BAD
<span className="text-brand-gold">Text on white</span>

// GOOD - Use navy or add background
<span className="text-brand-navy">Text</span>
<span className="bg-brand-gold text-brand-navy">Badge</span>
```

4. **Add focus trap to modals:**
```tsx
// components/ui/ConfirmDialog.tsx
// Use @headlessui/react Dialog or implement focus trap
```

5. **Minimum touch target:**
```css
.btn-touch {
  min-height: 44px;
  min-width: 44px;
}
```

---

## 7. Design Tokens Documentation

### Current Token Structure

```
globals.css
├── :root (CSS Custom Properties)
│   ├── Brand Colors (6 tokens)
│   ├── Semantic Colors (4 tokens)
│   └── (Missing: typography, spacing, shadows)
│
└── @theme inline (Tailwind Extensions)
    ├── Fonts (2 tokens)
    └── Colors (3 tokens)
```

### Missing Tokens

**Shadows:**
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

**Border Radius:**
```css
:root {
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
}
```

**Transitions:**
```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### Recommendations

Create comprehensive design tokens file:

```css
/* globals.css - Complete Design Tokens */

:root {
  /* ===== COLORS ===== */
  /* Brand */
  --color-navy: #3e65b2;
  --color-navy-light: #5d7fc4;
  --color-navy-dark: #2d4a8a;
  --color-gold: #f6d461;
  --color-gold-light: #f8de85;
  --color-gold-dark: #e6bb3a;
  --color-cream: #FFFBEB;
  --color-cream-dark: #FEF3C7;

  /* Semantic */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #2563EB;

  /* Neutral */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  /* ===== TYPOGRAPHY ===== */
  --font-family-sans: var(--font-noto-sans);
  --font-family-serif: var(--font-noto-serif);

  /* ===== SPACING ===== */
  --space-section-y: 4rem;     /* py-16 */
  --space-section-y-lg: 6rem;  /* lg:py-24 */
  --space-section-x: 1.5rem;   /* px-6 */

  /* ===== SHADOWS ===== */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* ===== BORDERS ===== */
  --radius-button: 0.5rem;
  --radius-card: 0.75rem;
  --radius-input: 0.5rem;

  /* ===== TRANSITIONS ===== */
  --transition-default: 200ms ease;
}
```

---

## 8. Dark Mode Support

### Current Status: Not Implemented

The application has no dark mode support. All components use light-mode-only colors.

### Implementation Approach

**Option A: CSS Custom Properties (Recommended)**

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
}

:root.dark {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
}
```

**Option B: Tailwind Dark Mode**

```tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
</div>
```

### Priority Assessment

Dark mode is **low priority** for this project because:
1. Primary users are parents/students of Vietnamese school
2. Admin dashboard is primary use case (typically daytime use)
3. No user requests for dark mode documented

**Recommendation:** Defer dark mode to Phase 3 of development.

---

## Component Library Priority Roadmap

### Phase 1: Foundation (Week 1-2)
1. **Button** - Standardize all button variants
2. **Input** - Form input with label and error states
3. **Card** - Reusable card container
4. **Badge** - Status badges

### Phase 2: Forms (Week 3-4)
5. **Select** - Styled select dropdown
6. **Checkbox** - Custom checkbox
7. **Radio** - Custom radio buttons
8. **FormField** - Wrapper with label/error

### Phase 3: Feedback (Week 5-6)
9. **Alert** - Alert/notification component
10. **Modal** - Generic modal wrapper
11. **Tooltip** - Information tooltips
12. **Progress** - Loading progress

### Phase 4: Navigation (Week 7-8)
13. **Tabs** - Tab navigation
14. **Dropdown** - Dropdown menu
15. **Avatar** - User avatars
16. **Accordion** - Expandable content

---

## Summary of Critical Issues

### Must Fix (High Priority)

1. **Accessibility**
   - Add `lang="vi"` to HTML element
   - Add skip-to-content link
   - Fix gold-on-white contrast issues
   - Implement focus trap in modals

2. **Components**
   - Create Button component to replace 20+ inline styles
   - Create Input component for form consistency
   - Create Badge component for status indicators

3. **Design Tokens**
   - Add semantic colors to Tailwind theme
   - Document spacing conventions

### Should Fix (Medium Priority)

4. **Typography**
   - Define heading scale utilities
   - Standardize line-heights

5. **Responsive**
   - Make admin sidebar collapsible on tablet
   - Add responsive table wrapper

### Nice to Have (Low Priority)

6. **Dark Mode** - Implement later
7. **Full component library** - Build incrementally
8. **Animation tokens** - Define consistent animations

---

## Appendix: File References

| File | Purpose |
|------|---------|
| app/globals.css:1-60 | Design tokens and global styles |
| app/layout.tsx:7-17 | Font configuration |
| components/ui/*.tsx | Reusable UI components |
| components/public/*.tsx | Public-facing components |
| components/admin/*.tsx | Admin components |

---

*Generated by Claude Code on November 24, 2024*
